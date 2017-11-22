/* eslint-disable no-shadow */
// import Vue from 'vue';
import * as types from '../mutations-types';


const state = {
  snackbars: [],
  displayedSnackbar: null,
};

const getters = {
  snackbars: state => state.snackbars,
  snackbar: state => state.displayedSnackbar,
};

const actions = {
  updateDisplayedSnackbar ({ commit, dispatch, state }) {
    console.log(state.snackbar, state.snackbars.length);
    if (!state.displayedSnackbar && state.snackbars.length) {
      console.log('made it');
      const snackbar = state.snackbars[0];
      window.setTimeout(() => {
        commit(types.CLEAR_DISPLAYED_SNACKBAR);
        window.setTimeout(() => {
          dispatch('updateDisplayedSnackbar');
        }, 800);
        console.log(state);
      }, snackbar.timeout || 3000);
      commit(types.UPDATE_SNACKBAR);
    }
  },
  addSnackbar ({ commit, dispatch }, { message, timeout }) {
    commit(types.ADD_SNACKBAR, { message, timeout });
    dispatch('updateDisplayedSnackbar');
  },
};

const mutations = {
  [types.UPDATE_SNACKBAR] (state) {
    state.displayedSnackbar = state.snackbars.shift();
  },
  [types.CLEAR_DISPLAYED_SNACKBAR] (state) {
    state.displayedSnackbar = null;
  },
  [types.ADD_SNACKBAR] (state, snackbar) {
    state.snackbars.push(snackbar);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
