/* eslint-disable no-shadow */
import Vue from 'vue';
import vbapi from '@/api/vbapi';
import { SAVE_GENERAL_OBS, DELETE_SURVEY, SAVE_SPECIES } from '../mutations-types';

const {
  getGeneralObservation,
  deleteSurvey,
} = vbapi;

// initial state
const state = {
  general: [],
};

// Getters
const getters = {
  generalObs: state => state.general.reverse(),
  observationsByDate: state => [...state.general]
    .sort((a, b) => new Date(b.surveyStartSdt) - new Date(a.surveyStartSdt)),
};

// Actions
const actions = {
  async getGeneralObs ({ rootGetters, commit, dispatch }) {
    try {
      const jwt = rootGetters['account/isLogin'];
      if (!jwt) throw new Error('Login required to access observations');
      const { records } = await getGeneralObservation(jwt);
      commit(SAVE_GENERAL_OBS, records);
    } catch (error) {
      dispatch('alerts/addSnackbar', { message: error.message, timeout: 2000 }, { root: true });
      console.log(error);
    }
  },

  async deleteSurvey ({ rootState, commit }, surveyId) {
    try {
      const jwt = rootState.account.jwt.value;
      const { deletedSurveyId } = await deleteSurvey(surveyId, jwt);
      commit(DELETE_SURVEY, Number(deletedSurveyId));
    } catch (error) {
      console.log(error);
    }
  },
};

// mutations
const mutations = {
  [SAVE_GENERAL_OBS] (state, records) {
    state.general = records;
  },
  [DELETE_SURVEY] (state, surveyId) {
    const newState = state.general.filter(record => record.surveyId !== surveyId);
    Vue.set(state, 'general', newState);
  },
  [SAVE_SPECIES] (state, { surveyId, species }) {
    const survey = state.general.find(obs => obs.surveyId === surveyId);
    Vue.set(survey, 'species', species);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
