/* eslint-disable no-shadow */
import Vue from 'vue';
import { isBefore, addMinutes } from 'date-fns';
import { get } from 'lodash';
import db from '@/store/db';
import api from '@/api/vbapi';
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
  onLine: null,
};

const getters = {
  isLogin: (state) => {
    const { value, expiration } = state.jwt;
    if (value !== null && isBefore(new Date(), expiration)) {
      return value;
    }
    return false;
  },
  isLoginAsGuest: (state) => {
    const { value, expiration } = state.guestJwt;
    return (value !== null && isBefore(new Date(), expiration))
      ? value
      : false;
  },
  onLine: state => state.onLine,
  displayName: state => state.username,
  status: state => state.status,
};
const actions = {
  // async revokeToken ({ commit, dispatch }) {
  //  const [account] = await db.account.toArray();
  // },
  updateOnlineStatus ({ commit }) {
    const onLine = navigator.onLine || false;
    commit(types.UPDATE_ONLINE_STATUS, { onLine });
  },
  async updateToken ({ commit, dispatch }) {
    try {
      const [account] = await db.account.toArray();
      if (!account) throw new Error('No locally saved account');
      const { userId, displayName, jwt, username, password } = account;
      console.log('found acc', displayName);
      console.log('is still valid');
      commit(types.SAVE_USER_INFO, { userId, displayName });
      await dispatch('fetchToken', { username, password });
      return Promise.resolve(jwt.value);
    } catch (error) {
      console.log(error);
      dispatch('alerts/addSnackbar', { message: error.message, timeout: 2000 }, { root: true });
      return Promise.reject(error);
    }
  },
  async fetchToken ({ commit }, { username, password }) {
    try {
      const {
        jwt,
        userUid: userId,
        displayName,
      } = await login(username, password);
      await db.account.clear();
      db.account.add({
        username,
        password,
        jwt: {
          value: jwt,
          expiration: addMinutes(new Date(), 29),
        },
        userId,
        displayName,
      });
      commit(types.STATUS, { message: 'Login successful' });
      commit(types.SAVE_TOKEN, { value: jwt, type: 'jwt' });
      commit(types.SAVE_USER_INFO, { userId, displayName });
    } catch (error) {
      const message = get(error, 'response.data.message', 'Login error');
      commit(types.STATUS, { message });
      throw error;
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
  async logout ({ commit }) {
    await db.account.clear();
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
  [types.UPDATE_ONLINE_STATUS] (state, { onLine }) {
    state.onLine = onLine;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
