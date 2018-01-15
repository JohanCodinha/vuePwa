/* eslint-disable no-shadow */
// import Vue from 'vue';
import * as types from '../mutations-types';

const state = {
  spinner: false,
};

const getters = {
  spinner: state => state.spinner,
};

const actions = {
  showSpinner ({ commit }) {
    commit(types.SHOW_SPINNER);
  },
  hideSpinner ({ commit }) {
    commit(types.HIDE_SPINNER);
  },
};

const mutations = {
  [types.SHOW_SPINNER] (state) {
    state.spinner = true;
  },
  [types.HIDE_SPINNER] (state) {
    state.spinner = false;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
