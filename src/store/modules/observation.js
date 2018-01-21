/* eslint-disable no-shadow */
import Vue from 'vue';
import vbapi from '@/api/vbapi';
import {
  SAVE_GENERAL_OBS,
  DELETE_SURVEY,
  SAVE_SPECIES,
  SAVE_RECORD,
} from '../mutations-types';

const {
  getGeneralObservation,
  deleteSurvey,
  expertReviewSurvey,
  getRecord,
} = vbapi;

// initial state
const state = {
  general: [],
  record: [],
};

// Getters
const getters = {
  generalObs: state => state.general.reverse(),
  observationsByDate: state => [...state.general]
    .sort((a, b) => new Date(b.surveyStartSdt) - new Date(a.surveyStartSdt)),
  recordById: state => taxonRecordedId =>
    state.record.find(record => record.taxonRecordedId === taxonRecordedId),
};

// Actions
const actions = {
  async getGeneralObs ({ rootGetters, commit, dispatch }) {
    try {
      dispatch('loading/showSpinner', null, { root: true });
      const jwt = rootGetters['account/isLogin'];
      if (!jwt) throw new Error('Login required to access observations');
      const { records } = await getGeneralObservation(jwt);
      dispatch('loading/hideSpinner', null, { root: true });
      commit(SAVE_GENERAL_OBS, records);
    } catch (error) {
      dispatch('alerts/addSnackbar', { message: error.message, timeout: 2000 }, { root: true });
      console.log(error);
    }
  },
  async getRecord ({ rootState, commit }, recordedTaxonId) {
    const jwt = rootState.account.jwt.value;
    try {
      const record = await getRecord(recordedTaxonId, jwt);
      console.log(record);
      commit(SAVE_RECORD, record);
    } catch (error) {
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

  async expertReviewSurvey ({ rootState, dispatch }, surveyId) {
    try {
      dispatch('loading/showSpinner', null, { root: true });
      const jwt = rootState.account.jwt.value;
      const response = await expertReviewSurvey(surveyId, jwt);
      dispatch('getGeneralObs');
      console.log(`${surveyId} was sent for expert review`);
      console.log(response);
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
  [SAVE_RECORD] (state, record) {
    const savedRecord = state.record.find(
      savedRecord => savedRecord.taxonRecordedId === record.taxonRecordedId);
    if (!savedRecord) state.record.push(record);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
