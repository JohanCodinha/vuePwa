import Vue from 'vue';
import mapboxApi from '@/api/mapbox';
import vbapi from '@/api/vbapi';
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
  async saveLocation ({ commit }, { latitude, longitude, accuracy, obsId }) {
    commit('SAVE_LOCATION', { latitude, longitude, accuracy, obsId });
    try {
      const place = await reverseGeocoding(longitude, latitude);
      const description = place.features[0].place_name;
      if (description) {
        commit(types.SAVE_LOCATION_DESCRIPTION, { description, obsId });
      }
    } catch (error) {
      console.log(error);
    }
  },
  setCount ({ commit }, { count, obsId }) {
    commit('SET_COUNT', { count, obsId });
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
  createObservation ({ commit }) {
    function generateId () {
      return Date.now();
    }
    const id = generateId();
    commit(types.CREATE_OBSERVATION, id);
    return id;
  },
  deleteObservation ({ commit }, obsId) {
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
      commit(types.SET_RECORDED_ID, { obsId: observation.id, taxonRecordedId });
      dispatch('getGeneralObs');
    } catch (error) {
      console.log(error);
    }
  },
  addImage ({ commit }, { image, obsId }) {
    commit('SAVE_IMAGE', { image, obsId });
  },
  selectSpecie ({ commit }, { specie, obsId }) {
    commit('SELECT_SPECIE', { specie, obsId });
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
  [types.CREATE_OBSERVATION] (state, id) {
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
    };
    state.items.push(observation);
  },
  [types.DELETE_OBSERVATION] (state, obsId) {
    const observationIndex = state.items.findIndex(obs => obs.id !== obsId);
    // Vue.set(state, 'items', itemsWithoutObs);
    state.items.splice(observationIndex, 1);
  },
  [types.SAVE_IMAGE] (state, { image, obsId }) {
    const observation = state.items.find(obs => obs.id === obsId);
    observation.images.push(image);
  },
  [types.SELECT_SPECIE] (state, { specie, obsId }) {
    const observation = state.items.find(obs => obs.id === obsId);
    observation.taxonomy.taxonId = specie.taxonId;
    observation.taxonomy.commonName = specie.commonName
      ? specie.commonName
      : null;
    observation.taxonomy.scientificName = specie.scientificName
      ? specie.scientificName
      : null;
  },
  [types.SET_DATETIME] (state, { datetime, observation }) {
    // const observation = state.items.find(obs => obs.id === obsId);
    Vue.set(observation, 'datetime', datetime);
  },
  [types.SET_ACTIVE_DRAFT] (state, { obsId }) {
    Vue.set(state, 'activeDraftId', obsId);
  },
  [types.SAVE_LOCATION] (state, { latitude, longitude, accuracy, obsId }) {
    const observation = state.items.find(obs => obs.id === obsId);
    Vue.set(observation, 'position', {
      latitude,
      longitude,
      accuracy,
    });
  },
  [types.SAVE_LOCATION_DESCRIPTION] (state, { description, obsId }) {
    const observation = state.items.find(obs => obs.id === obsId);
    Vue.set(observation.position, 'description', description);
  },
  [types.SET_COUNT] (state, { count, obsId }) {
    const observation = state.items.find(obs => obs.id === obsId);
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
