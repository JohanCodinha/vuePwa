/* eslint-disable */
import store from '../../store';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const $store = new Vuex.Store(store);
 
describe('Login user', () => {
 test('User can login', async () => {
   const res = await $store.dispatch('account/fetchToken', { 
    username: 'codeForVic',
    password: '19910908'
  }, { root: true });
   // console.log('getter',$store.getters['account/isLogin']);
   // console.log('jwt',$store.state.account.jwt.value);
  expect(typeof $store.getters['account/isLogin'])
   .toBe('string');
 }); 
});
