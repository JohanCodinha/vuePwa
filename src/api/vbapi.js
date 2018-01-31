import axios from 'axios';
import get from 'lodash/get';
import store from '@/store';

// const baseURL = 'https://vbago.science/vbapi';
const baseURL = 'http://localhost:9000';

const http = axios.create({
  baseURL,
});

http.interceptors.response.use(response => response,
  async (requestError) => {
    /* eslint-disable no-underscore-dangle */
    try {
      const originalRequest = requestError.config;
      const responseStatus = get(requestError, 'response.status');
      const networkError = (requestError.message === 'Network Error');
      if (responseStatus === 401 || originalRequest._retry || networkError) throw requestError;
      await store.dispatch('account/updateToken');
      const jwt = store.getters['account/isLogin'];
      originalRequest.headers['x-access-token'] = jwt;
      originalRequest._retry = true;
      return http(originalRequest);
    } catch (error) {
      return Promise.reject(error);
    }
  });

export default {
  autocomplete: (query, discipline) => http
    .get('/search', {
      params: {
        query,
        discipline,
      },
    })
    .then(res => res.data),

  login: (username, password) => http
    .post('/auth', {
      username,
      password,
    })
    .then(res => res.data),

  guestLogin: () => http
    .get('/auth/guest')
    .then(res => res.data.jwt),

  postObservation: (formData, jwt) => http
    .post('/record',
      formData,
      { headers: { 'x-access-token': jwt } },
    )
    .then(res => res.data),

  deleteSurvey: (surveyId, jwt) => http
    .delete(`/surveys/${surveyId}`, {
      headers: { 'x-access-token': jwt },
    })
    .then(res => res.data),

  expertReviewSurvey: (surveyId, jwt) => http
    .post(`/surveys/${surveyId}/review`, {}, {
      headers: { 'x-access-token': jwt },
    })
    .then(res => res.data),

  getGeneralObservation: jwt => http
    .get('/search/userObservations', {
      headers: { 'x-access-token': jwt },
    })
    .then(res => res.data),

  getMethods: (surveyId, jwt) => http
    .get(`/surveys/${surveyId}/methods`, {
      headers: { 'x-access-token': jwt },
    })
    .then(res => res.data),

  getMethodsSpecies: (methodId, jwt) => http
    .get(`/methods/${methodId}/species`, {
      headers: { 'x-access-token': jwt },
    })
    .then(res => res.data),

  getSpeciesMedia: (specieId, jwt) => http
    .get(`/species/${specieId}/media`, {
      headers: { 'x-access-token': jwt },
    })
    .then(res => res.data),

  searchSpecies: (position, jwt) => http
    .get('/search/point', {
      headers: { 'x-access-token': jwt },
      params: position,
    })
    .then(res => res.data),

  searchSpecieRecords: (position, taxonId, jwt) => http
    .get('/search/point', {
      headers: { 'x-access-token': jwt },
      params: Object.assign({}, position, { detail: true, taxonId }),
    })
    .then(res => res.data),

  getRecord: (taxonRecordedId, jwt) => http
    .get(`/record/${taxonRecordedId}`, {
      headers: { 'x-access-token': jwt },
    })
    .then(res => res.data),
};
