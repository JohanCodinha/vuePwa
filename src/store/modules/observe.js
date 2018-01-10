import Vue from 'vue';
import mapboxApi from '@/api/mapbox';
import vbapi from '@/api/vbapi';
import db from '@/store/db';
import * as types from '../mutations-types';

const { reverseGeocoding } = mapboxApi;
const { postObservation } = vbapi;

// initial state
const state = {
  items: [],
};

// Getters
const getters = {
  getObservationById: state => id => state.items.find(item => item.id === id),
  allitems: state => state.items,
  activeDraft: (state) => {
    const ad = state.items.find(draft => draft.id === state.activeDraftId);
    return ad;
  },
};

function ConvertDMSToDD (degrees, minutes, seconds, direction) {
  if (typeof degrees !== 'number'
    || typeof minutes !== 'number'
    || typeof seconds !== 'number') return undefined;
  const dd = degrees
    + minutes / 60
    + seconds / (60 * 60);
  if (direction === 'S' || direction === 'W') {
    return dd * -1;
  } // Don't do anything for N or E
  return dd;
}
function formatDate (exifDate) {
  const [date, time] = [...exifDate.split(' ')];
  return `${date.replace(/:/g, '-')}T${time}`;
}
// Actions
const actions = {
  /* eslint-disable */
  async loadObservation ({ commit, getters }) {
    const dbObservations = await db.observe.toArray();
    dbObservations.forEach((observation) => {
      let imagesAsBlob = observation.images.map((image) => {
        const { data, metadata } = image;
        return {
          metadata,
          data: new Blob( [data], { type: "image/jpeg" } ),
        };
      });
      observation.images = imagesAsBlob; 
      commit(types.SAVE_OBSERVATION, observation);
    });
  },
  async saveLocation ({ commit, getters }, { latitude, longitude, accuracy, obsId }) {
    const observation = getters.getObservationById(obsId);
    const position = {
      latitude,
      longitude,
      accuracy,
    };
    await db.observe.where('id').equals(obsId).modify(obs => 
      obs.position = position);
    commit('SAVE_LOCATION', { position, observation });
    try {
      const place = await reverseGeocoding(longitude, latitude);
      const description = place.features[0].place_name;
      if (description) {
        await db.observe.where('id').equals(obsId).modify(obs => 
          obs.position.description = description);
        commit(types.SAVE_LOCATION_DESCRIPTION, { description, observation });
      }
    } catch (error) {
      console.log(error);
    }
  },
  async setCount ({ commit, getters }, { count, obsId }) {
    const observation = getters.getObservationById(obsId);
    await db.observe.where('id').equals(obsId).modify(obs => 
      obs.count = count);
    commit('SET_COUNT', { count, observation });
  },
  getImageMetadata ({ commit, dispatch }, { image, obsId }) {
    function getExif (img, tags) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        const ExifWorker = require('worker-loader?inline!./exifWorker.js');
        const worker = new ExifWorker();
        worker.onmessage = message => resolve(message.data);
        worker.onerror = message => reject(message);
        worker.postMessage({ image: img, tags });
      });
    }
    const tags = {
      latitude: 'GPSLatitude',
      latitudeRef: 'GPSLatitudeRef',
      longitude: 'GPSLongitude',
      longitudeRef: 'GPSLongitudeRef',
      datetime: 'DateTimeOriginal',
      positioningError: 'GPSHPositioningError',
      dilutionOfPrecision: 'GPSDOP',
    };
    return getExif(image, tags)
  },
  async processExifData ({ commit, dispatch }, { imageMetadata, obsId }) {
    try {
      const { latitude, latitudeRef, longitude, longitudeRef, datetime,
        positioningError, dilutionOfPrecision } = imageMetadata;
      if (latitude && longitude ) {
        const ddLatitude = ConvertDMSToDD(...latitude, latitudeRef);
        const ddLongitude = ConvertDMSToDD(...longitude, longitudeRef);
        if (ddLatitude && ddLongitude) {
          const accuracy = positioningError || dilutionOfPrecision;
          dispatch('saveLocation', {
            latitude: ddLatitude,
            longitude: ddLongitude,
            accuracy,
            obsId,
          });
        }
      }
      const datetimeString = datetime
        ? formatDate(datetime)
        : null;
      const observation = getters.getObservationById(obsId);
      if (datetimeString) {
        commit(types.SET_DATETIME, { datetime: datetimeString, observation });
      }
    } catch (error) {
      console.log(error);
    }
  },
  async createObservation ({ commit }) {
    function generateId () {
      return Date.now();
    }
    const id = generateId();
    const observation = {
      id,
      images: [],
      taxonomy: {
        taxonId: null,
        commonName: null,
        scientificName: null,
      },
      position: {
        accuracy: null,
        description: null,
        latitude: null,
        longitude: null,
      },
      datetime: null,
      count: 0,
      discipline: null,
    };
    await db.observe.add(observation);
    commit(types.SAVE_OBSERVATION, observation);
    return id;
  },
  async deleteObservation ({ commit }, obsId) {
    await db.observe.where('id').equals(obsId).delete();
    commit('DELETE_OBSERVATION', obsId);
  },

  async uploadObservation ({ rootState, commit, dispatch }, { observation }) {
    const jwt = rootState.account.jwt.value;
    const { userId, username } = rootState.account;
    const images = observation.images.map(image => image.data);
    const {
      latitude,
      longitude,
      accuracy,
      description,
    } = observation.position;
    const { commonName, scientificName, taxonId } = observation.taxonomy;
    const { count, extraInfoCode, datetime, discipline, notes } = observation;

    const formData = new FormData();
    images.forEach(image => formData.append('images', image));
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('accuracy', accuracy || 5);
    formData.append('commonName', commonName);
    formData.append('scientificNmae', scientificName);;
    formData.append('taxonId', taxonId);
    formData.append('count', count || 1);
    formData.append('dateTime', datetime);
    formData.append('extraInfoCode', extraInfoCode);
    formData.append('userId', userId);
    formData.append('obsName', username);
    formData.append('locationDescription', description);
    formData.append('discipline', discipline);
    formData.append('notes', notes);

    try {
      const { taxonRecordedId } = await postObservation(formData, jwt);
      console.log(taxonRecordedId);
      if (!taxonRecordedId) throw new Error('upload failed');
      commit(types.SET_RECORDED_ID, { obsId: observation.id, taxonRecordedId });
      dispatch('alerts/addSnackbar', { message: 'Upload success !', timeout: 3500 }, { root: true });
      dispatch('getGeneralObs');
    } catch (error) {
      dispatch('alerts/addSnackbar', { message: error.message, timeout: 3500 }, { root: true });
      return error;
    }
  },
  async removeImage ({commit, getters}, { imageId, obsId }) {
    const observation = getters.getObservationById(obsId);
    console.log('madeit', observation, obsId);
    commit('DELETE_IMAGE', { imageId, observation });
  },
  async addImage ({ commit, getters }, { image: imageFile, metadata, obsId }) {
    const fileToArrayBuffer = function (file) {
      return new Promise ((resolve, reject) => {
        let arrayBuffer;
        let fileReader = new FileReader();
        fileReader.onload = function() {
          resolve(this.result);
        }
        return fileReader.readAsArrayBuffer(file);
      });
    }
    try {
      const {
        latitude,
        latitudeRef,
        longitude, 
        longitudeRef, 
        datetime,
        positioningError, 
        dilutionOfPrecision 
      } = metadata;
      let ddLatitude = null;
      let ddLongitude = null;
      if (latitude && longitude) {
        ddLatitude = ConvertDMSToDD(...latitude, latitudeRef);
        ddLongitude = ConvertDMSToDD(...longitude, longitudeRef);
      }
      const datetimeString = datetime
        ? formatDate(datetime)
        : null;
      const accuracy = positioningError || dilutionOfPrecision;
      const metadataParsed = {
        latitude: ddLatitude,
        longitude: ddLongitude,
        accuracy,
        datetime: datetimeString,
        allMetaData: metadata.allMetaData,
      };
      console.log(metadataParsed.allMetaData)
      const observation = getters.getObservationById(obsId);
      const imageId = observation.images.length + 1;
      metadataParsed.id = imageId;

      const imageArrayBuffer = await fileToArrayBuffer(imageFile);
      const image = { data: imageArrayBuffer, metadata: metadataParsed };
      commit('SAVE_IMAGE', { image: { data: imageFile, metadata: metadataParsed }, observation });
      await db.observe.where('id').equals(obsId)
        .modify(obs => obs.images.push(image));
    } catch (error) {
      console.log('here', error);
    }
  },
  async selectSpecie ({ commit, getters }, { specie, obsId }) {
    const { 
      taxonId,
      commonName = null,
      scientificName = null,
      discipline : { primary : discipline }, // extract specie.discipline.primary into discipline
    } = specie;
    const observation = getters.getObservationById(obsId);
    const taxonomy = {
      taxonId,
      commonName,
      scientificName,
    };
    const updatedObservation = Object.assign({}, observation, { taxonomy });
    await db.observe.where('id').equals(obsId).modify((obs) => {
      obs.discipline = discipline;
      obs.taxonomy = taxonomy;
    });
    commit('SET_DISCIPLINE', { discipline, observation });
    commit('SELECT_SPECIE', { taxonomy, observation });
  },
  setActiveDraft ({ commit }, { obsId }) {
    commit('SET_ACTIVE_DRAFT', { obsId });
  },
  setExtraInfo ({ commit }, { code, obsId }) {
    commit('SET_EXTRA_CODE', { code, obsId });
  },
  setNotes ({ commit, getters }, { notes, obsId }) {
    const observation = getters.getObservationById(obsId)
    console.log(observation, notes, obsId);
    db.observe.where('id').equals(obsId).modify(obs => 
      obs.notes = notes );
    commit('SET_NOTES', { notes, observation });
  },
  setDatetime ({ commit, getters }, { datetimeString, obsId }) {
    const observation = getters.getObservationById(obsId);
    console.log(observation);
    commit(types.SET_DATETIME, { datetime: datetimeString, observation });
  },
};

// mutations
const mutations = {
  [types.SAVE_OBSERVATION] (state, observation) {
    state.items.push(observation);
  },
  [types.DELETE_OBSERVATION] (state, obsId) {
    const observationIndex = state.items.findIndex(obs => obs.id === obsId);
    state.items.splice(observationIndex, 1);
  },
  [types.SAVE_IMAGE] (state, { image, observation }) {
    observation.images.push(image);
  },
  [types.DELETE_IMAGE] (state, { imageId, observation }) {
    const imageIndex = observation.images.findIndex(image => image.metadata.id === imageId);
    observation.images.splice(imageIndex, 1);
  },
  [types.SELECT_SPECIE] (state, { taxonomy, observation }) {
    Vue.set(observation, 'taxonomy', taxonomy);

  },
  [types.SET_DATETIME] (state, { datetime, observation }) {
    Vue.set(observation, 'datetime', datetime);
  },
  [types.SET_ACTIVE_DRAFT] (state, { obsId }) {
    Vue.set(state, 'activeDraftId', obsId);
  },
  [types.SAVE_LOCATION] (state, { position, observation }) {
    Vue.set(observation, 'position', position);
  },
  [types.SAVE_LOCATION_DESCRIPTION] (state, { description, observation }) {
    Vue.set(observation.position, 'description', description);
  },
  [types.SET_COUNT] (state, { count, observation }) {
    Vue.set(observation, 'count', count);
  },
  [types.SET_NOTES] (state, { notes, observation }) {
    Vue.set(observation, 'notes', notes);
  },
  [types.SET_EXTRA_CODE] (state, { code, obsId }) {
    const observation = state.items.find(obs => obs.id === obsId);
    Vue.set(observation, 'extraInfoCode', code);
  },
  [types.SET_RECORDED_ID] (state, { obsId, taxonRecordedId }) {
    const observation = state.items.find(obs => obs.id === obsId);
    Vue.set(observation, 'recordedId', taxonRecordedId);
  },
  [types.SET_DISCIPLINE] (state, { discipline, observation }) {
    Vue.set(observation, 'discipline', discipline);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
