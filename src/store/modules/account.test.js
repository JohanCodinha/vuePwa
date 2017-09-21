/* eslint-disable */
import store from '../../store';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const $store = new Vuex.Store(store);
 
describe('Login user', () => {
  test('User can login', async () => {
    await $store.dispatch('account/fetchToken', { 
      username: 'codeForVic',
      password: '19910908'
    }, { root: true });
    // console.log($store.state.statue);
    expect(typeof $store.getters['account/isLogin'])
      .toBe('string');
  });
  test('Loged-in user can logout', () => {
    expect(typeof $store.getters['account/isLogin'])
      .toBe('string');
    $store.dispatch('account/logout');
    expect($store.getters['account/isLogin'])
      .toBe(false);
  });
});
