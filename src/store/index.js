import Vue from 'vue';
import Vuex from 'vuex';
import observe from './modules/observe';
import observation from './modules/observation';
import account from './modules/account';
import explore from './modules/explore';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    account,
    observation,
    observe,
    explore,
  },
});

export default store;
