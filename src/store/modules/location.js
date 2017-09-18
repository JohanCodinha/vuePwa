import Vue from 'vue';
import * as types from '../mutations-types';

const state = {
  latitude: null,
  longitude: null,
  accuracy: null,
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
  async getPosition ({ commit }) {
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
          reject(err.message);
        }, options);
    });
    try {
      const position = await getCurrentPosition();
      commit(types.SET_POSITION, position);
    } catch (error) {
      commit(types.POSITION_ERROR, error);
    }
  },
};

const mutations = {
  [types.SET_POSITION] (state, { latitude, longitude, accuracy }) {
    const timestamp = Date.now();
    const previousLat = state.position.latitude;
    const previousLon = state.position.longitude;
    const previousAccu = state.position.accuracy;

    const position = {
      latitude: latitude || previousLat,
      longitude: longitude || previousLon,
      accuracy: accuracy || previousAccu,
      timestamp,
    };

    Vue.set(state, 'position', position);
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
