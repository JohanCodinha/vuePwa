/* @flow */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import { sync } from 'vuex-router-sync';
import App from './App';
import router from './router';
import store from './store';

Vue.use(Vuex);
const vuexStore = new Vuex.Store(store);
sync(vuexStore, router);
Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: vuexStore,
  template: '<App/>',
  components: { App },
});
