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

// Actions
const actions = {
  /* eslint-disable */
  async loadObservation ({ commit, getters }) {
    const dbObservations = await db.observe.toArray();
    dbObservations.forEach((observation) => {
      let imagesAsBlob = observation.images.map((buffer) => {
        return new Blob( [buffer ], { type: "image/jpeg" } ); 
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
  hydrateImageMetadata ({ commit, dispatch }, { image, obsId }) {
    console.log(image);
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
    const tags = {
      latitude: 'GPSLatitude',
      latitudeRef: 'GPSLatitudeRef',
      longitude: 'GPSLongitude',
      longitudeRef: 'GPSLongitudeRef',
      datetime: 'DateTimeOriginal',
      positioningError: 'GPSHPositioningError',
      dilutionOfPrecision: 'GPSDOP',
    };
    console.time('getExif');
    return getExif(image, tags)
      .then(({ latitude, latitudeRef, longitude, longitudeRef, datetime,
        positioningError, dilutionOfPrecision }) => {
        console.timeEnd('getExif');
        console.log(latitude, latitudeRef, longitude, longitudeRef,
          datetime, positioningError, dilutionOfPrecision);
        const ddLatitude = ConvertDMSToDD(...latitude, latitudeRef);
        const ddLongitude = ConvertDMSToDD(...longitude, longitudeRef);
        const datetimeString = datetime
          ? formatDate(datetime)
          : null;
        const accuracy = positioningError || dilutionOfPrecision;
        const observation = getters.getObservationById(obsId);

        dispatch('saveLocation', {
          latitude: ddLatitude,
          longitude: ddLongitude,
          accuracy,
          obsId,
        });
        // dispatch('setDatetime', { datetime: datetimeString, obsId });
        commit(types.SET_DATETIME, { datetime: datetimeString, observation });
      }).catch((error) => {
        console.log(error);
      });
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
    const images = observation.images;
    const {
      latitude,
      longitude,
      accuracy,
      description,
    } = observation.position;
    const { commonName, scientificName, taxonId } = observation.taxonomy;
    const { count, extraInfoCode, datetime } = observation;

    const formData = new FormData();
    images.forEach(image => formData.append('images', image));
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('accuracy', accuracy || 5);
    formData.append('commonName', commonName);
    formData.append('scientificNmae', scientificName);
    formData.append('taxonId', taxonId);
    formData.append('count', count || 1);
    formData.append('dateTime', datetime);
    formData.append('extraInfoCode', extraInfoCode);
    formData.append('userId', userId);
    formData.append('obsName', username);
    formData.append('locationDescription', description);
    try {
      const { taxonRecordedId } = await postObservation(formData, jwt);
      console.log(taxonRecordedId);
      if (!taxonRecordedId) throw new Error('upload failed');
      commit(types.SET_RECORDED_ID, { obsId: observation.id, taxonRecordedId });
      dispatch('getGeneralObs');
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  },
  async addImage ({ commit, getters }, { image, obsId }) {
    let arrayBuffer;
    let fileReader = new FileReader();
    fileReader.onload = async function() {
      arrayBuffer = this.result;
      try {
        await db.observe.where('id').equals(obsId).modify(obs => 
          obs.images.push(arrayBuffer));
      } catch (error) {
        console.log(error.message);
        alert('fail to save image');
      }
    };
    fileReader.readAsArrayBuffer(image); 
    const observation = getters.getObservationById(obsId);
    commit('SAVE_IMAGE', { image, observation });
  },
  async selectSpecie ({ commit, getters }, { specie, obsId }) {
    const { taxonId, commonName = null, scientificName = null } = specie;
    const observation = getters.getObservationById(obsId);
    const taxonomy = {
      taxonId,
      commonName,
      scientificName,
    };
    const updatedObservation = Object.assign({}, observation, { taxonomy });
    await db.observe.where('id').equals(obsId).modify(obs => 
      obs.taxonomy = taxonomy);
    commit('SELECT_SPECIE', { taxonomy, observation });
  },
  setActiveDraft ({ commit }, { obsId }) {
    commit('SET_ACTIVE_DRAFT', { obsId });
  },
  setExtraInfo ({ commit }, { code, obsId }) {
    commit('SET_EXTRA_CODE', { code, obsId });
  },
  setDatetime ({ commit, getters }, { datetimeString, obsId }) {
    const observation = getters.getObservationById(obsId);
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
  [types.SET_EXTRA_CODE] (state, { code, obsId }) {
    const observation = state.items.find(obs => obs.id === obsId);
    Vue.set(observation, 'extraInfoCode', code);
  },
  [types.SET_RECORDED_ID] (state, { obsId, taxonRecordedId }) {
    const observation = state.items.find(obs => obs.id === obsId);
    Vue.set(observation, 'recordedId', taxonRecordedId);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
