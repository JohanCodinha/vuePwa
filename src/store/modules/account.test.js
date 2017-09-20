/* eslint-disable */
import store from '../../store';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const $store = new Vuex.Store(store);
 
describe('Login user', () => {
 test('User can login', async () => {
  $store.dispatch('fetchToken', { 
    username: 'codeForVic',
    password: '19910908'
  }, { root: true });
  expect($store.getters['account/isLogin'])
   .toBeInstanceOf(String);
 }); 
});
