import axios from 'axios';
import store from '@/store';

// const baseURL = 'https://vbago.science/vbapi';
const baseURL = 'http://localhost:9000';

const http = axios.create({
  baseURL,
});

http.interceptors.response.use(response => response,
  async (error) => {
    /* eslint-disable no-underscore-dangle */
    const originalRequest = error.config;
    if (error.message === 'Network Error') {
      return Promise.reject(error);
    }
    if (originalRequest._retry) return Promise.reject(error);
    if (originalRequest.url === `${originalRequest.baseURL}/auth`) return Promise.reject(error);
    console.log(error.config);
    originalRequest._retry = true;
    try {
      await store.dispatch('account/updateToken');
      const jwt = store.getters['account/isLogin'];
      originalRequest.headers['x-access-token'] = jwt;
      return http(originalRequest);
    } catch ({ message }) {
      store.dispatch('errors/addSnackbar', { message, timeout: 3500 }, { root: true });
    }
    return Promise.reject(error);
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

  getGeneralObservation: async (jwt) => {
    store.dispatch('loading/showSpinner', { root: true });
    const { data } = await http
      .get('/search/userObservations', {
        headers: { 'x-access-token': jwt },
      });
    store.dispatch('loading/hideSpinner', { root: true });
    return data;
  },

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
};
