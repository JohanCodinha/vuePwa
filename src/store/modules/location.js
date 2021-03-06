// import Vue from 'vue';
import * as types from '../mutations-types';

const state = {
  latitude: null,
  longitude: null,
  accuracy: null,
  lastRefresh: null,
  error: null,
};

// getters
const getters = {
  position: (state) => {
    const position = {
      latitude: state.latitude,
      longitude: state.longitude,
      accuracy: state.accuracy,
    };
    return position;
  },
};
const actions = {
  async getPosition ({ commit, dispatch }) {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };
    const getCurrentPosition = new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error("Device doesn't support geolocation"));
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const accuracy = pos.coords.accuracy;
          const latitude = pos.coords.latitude;
          const longitude = pos.coords.longitude;
          console.log(`Position ok, accuracy : ${pos.coords.accuracy}`);
          resolve({ accuracy, latitude, longitude });
        },
        (err) => {
          switch (err.code) {
            case 1:
              reject(new Error('Enable permission to access geolocation information.'));
              break;
            case 2:
              reject(new Error('The acquisition of the geolocation failed.'));
              break;
            case 3:
              reject(new Error('The acquisition of the geolocation took too long.'));
              break;
            default:
              reject(new Error('Could not find geolocation'));
              break;
          }
        }, options);
    });
    try {
      const position = await getCurrentPosition;
      console.log(position);
      commit(types.SET_POSITION, position);
      return position;
    } catch (error) {
      dispatch('alerts/addSnackbar', { message: error.message, timeout: 3500 }, { root: true });
      commit(types.POSITION_ERROR, error);
      throw error;
    }
  },
};

const mutations = {
  [types.SET_POSITION] (state, { latitude, longitude, accuracy }) {
    const timestamp = Date.now();
    const previousLat = state.latitude;
    const previousLon = state.longitude;
    const previousAccu = state.accuracy;
    console.log(state);
    // const position = {
    state.latitude = latitude || previousLat;
    state.longitude = longitude || previousLon;
    state.accuracy = accuracy || previousAccu;
    state.lastRefresh = timestamp;
    // };
    // console.log(position);
    // Vue.set(state, 'position', position);
  },
  [types.POSITION_ERROR] (state, error) {
    state.error = error;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
