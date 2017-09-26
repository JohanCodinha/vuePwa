/* eslint-disable no-shadow */
import Vue from 'vue';
import vbapi from '@/api/vbapi';
import { SAVE_GENERAL_OBS, DELETE_SURVEY, SAVE_SPECIES } from '../mutations-types';

const {
  getGeneralObservation,
  deleteSurvey,
  getMethods,
  getMethodsSpecies,
  getSpeciesMedia } = vbapi;

// initial state
const state = {
  general: [],
};

// Getters
const getters = {
  general: state => state.general.reverse(),
};

// Actions
const actions = {
  async getGeneralObs ({ rootState, commit }) {
    try {
      const jwt = rootState.account.jwt.value;
      const { records } = await getGeneralObservation(jwt);
      commit(SAVE_GENERAL_OBS, records);
    } catch (error) {
      console.log(error);
    }
  },

  async getSurveySpecies ({ rootState, commit }, surveyId) {
    try {
      const jwt = rootState.account.jwt.value;
      const { methods } = await getMethods(surveyId, jwt);
      const methodsSpecies = await Promise.all(
        methods.map(method => getMethodsSpecies(method.componentId, jwt)),
      );
      const species = methodsSpecies
        .reduce((accu, value) => [...accu, ...value.species], []);
      const speciesMedia = await Promise.all(
        species.map(specie => getSpeciesMedia(specie.id, jwt)),
      );
      const hydratedSpecies = species.map((specie, index) => Object.assign(
        {}, specie, speciesMedia[index]));
      commit(SAVE_SPECIES, { surveyId, species: hydratedSpecies });
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
};

// mutations
const mutations = {
  [SAVE_GENERAL_OBS] (state, records) {
    state.general.push(...records);
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
