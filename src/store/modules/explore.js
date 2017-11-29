import Vue from 'vue';
import { get } from 'lodash';
import api from '@/api/vbapi';
import * as types from '../mutations-types';

const { searchSpecies, searchSpecieRecords } = api;

const state = {
  searchRadius: 250,
  status: {
    searched: false,
    error: null,
  },
  species: [],
  records: [],
};

// getters
const getters = {
  searchArea: (state, getters, rootState, rootGetters) => {
    console.log(rootGetters);
    const { latitude, longitude } = rootGetters['location/position'];
    if (latitude || longitude) {
      return {
        lat: latitude,
        long: longitude,
        rad: state.searchRadius,
      };
    }
    return false;
  },
  species: state => state.species,
  status: state => state.status,
  // position: state => state.position,
  records: state => state.records,
  speciesByTaxonId: state => id => state.species.find(item => item.taxonId === id),
};

const actions = {
  async searchSpecies ({ commit, getters, rootGetters, dispatch }) {
    if (!rootGetters['account/isLoginAsGuest'] || !rootGetters['account/isLogin']) {
      await dispatch('account/loginAsGuest', null, { root: true });
    }
    if (!getters.searchArea) {
      await dispatch('location/getPosition', null, { root: true });
    }
    const token = rootGetters['account/isLoginAsGuest'] || rootGetters['account/isLogin'];
    const searchArea = getters.searchArea;
    if (!token || !searchArea) {
      throw new Error('Search could not be perform, missing search parameters and/or token');
    }

    try {
      const { records: species } = await searchSpecies(searchArea, token);
      commit(types.UPDATE_STATUS, { searched: true });
      if (!species) {
        throw new Error('No species found at location');
      }
      commit(types.CLEAR_AROUND_SPECIES);
      species.forEach(async (specie) => {
        if (get(specie, 'countOfSightings') > 0) {
          commit(types.ADD_SPECIE, specie);
        }
        const { records } = await searchSpecieRecords(searchArea, specie.taxonId, token);
        commit(types.CLEAR_SPECIE_RECORDS, { taxonId: specie.taxonId });
        commit('ADD_RECORDS', records);
      });
    } catch (error) {
      console.log(error);
      dispatch('errors/addSnackbar', { message: error.message, timeout: 3500 }, { root: true });
    }
  },
};

const mutations = {
  [types.ADD_SPECIE] (state, specie) {
    state.species.push(specie);
  },
  [types.CLEAR_AROUND_SPECIES] (state) {
    Vue.set(state, 'species', []);
  },
  [types.UPDATE_STATUS] (state, statusUpdate) {
    const newStatus = Object.assign({}, state.status, statusUpdate);
    Vue.set(state, 'status', newStatus);
  },
  [types.ADD_RECORDS] (state, records) {
    state.records.push(...records);
  },
  [types.CLEAR_SPECIE_RECORDS] (state, { taxonId }) {
    state.records = state.records.filter(record => record.taxonId !== taxonId);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
