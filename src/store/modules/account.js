/* eslint-disable no-shadow */
import Vue from 'vue';
import { isBefore, addMinutes } from 'date-fns';
import { get } from 'lodash';
import api from '@/api/vba';
import * as types from '../mutations-types';

const { login, guestLogin } = api;
const state = {
  jwt: {
    value: null,
    expiration: null,
  },
  guestJwt: {
    value: null,
    expiration: null,
  },
  username: null,
  userId: null,
  status: null,
};

const getters = {
  isLogin: (state) => {
    const { value, expiration } = state.jwt;
    return (value !== null && isBefore(new Date(), expiration))
      ? value
      : false;
  },
  isLoginAsGuest: (state) => {
    const { value, expiration } = state.guestJwt;
    return (value !== null && isBefore(new Date(), expiration))
      ? value
      : false;
  },
  displayName: state => state.displayName,
  status: state => state.status,
};

const actions = {
  async fetchToken ({ commit }, { username, password }) {
    try {
      const { jwt, userUid: userId, displayName } = await login(username, password);
      commit(types.STATUS, { message: 'Login successful' });
      commit(types.SAVE_TOKEN, { value: jwt, type: 'jwt' });
      commit(types.SAVE_USER_INFO, { userId, displayName });
    } catch (error) {
      const message = get(error, 'response.data.message', 'Login error');
      commit(types.STATUS, { message });
    }
    return 'done';
  },
  async loginAsGuest ({ commit }) {
    try {
      const jwt = await guestLogin();
      commit(types.SAVE_TOKEN, { value: jwt, type: 'guestJwt' });
    } catch (error) {
      commit(types.STATUS, { message: error.message });
    }
  },
  logout ({ commit }) {
    commit(types.RESET_USER_INFO);
  },
};

const mutations = {
  [types.SAVE_TOKEN] (state, { value, type }) {
    const jwt = {
      value,
      expiration: addMinutes(new Date(), 29),
    };
    Vue.set(state, type, jwt);
  },
  [types.SAVE_USER_INFO] (state, { userId, displayName }) {
    Vue.set(state, 'username', displayName);
    Vue.set(state, 'userId', userId);
  },
  [types.STATUS] (state, { message }) {
    Vue.set(state, 'status', message);
  },
  [types.RESET_USER_INFO] (state) {
    state.jwt = {
      value: null,
      expiration: null,
    };
    state.username = null;
    state.userId = null;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
