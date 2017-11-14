/* eslint-disable */
jest.mock('@/api/vba', () => {
  return {
    login: () => new Promise(resolve => resolve(JSON.parse('{"jwt":"zR7lxC2HQO0W44ck56XAITBw8EARDdoctTxLEaS1tgc","userUid":10660,"displayName":"johan codinha"}')))
  }  
});

import store from '@/store';
import Vue from 'vue';
import Vuex from 'vuex';

let $store;

beforeEach(() => {
  Vue.use(Vuex);
  $store = new Vuex.Store(store);
}); 

describe('Login user', () => {
  test('User can login', async () => {
    const res = await $store.dispatch('account/fetchToken', { 
      username: 'codeForVic',
      password: '19910908'
    }, { root: true });
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
