import Vue from 'vue';
import Vuex from 'vuex';
import observe from './modules/observe';
import observation from './modules/observation';
import account from './modules/account';
import explore from './modules/explore';
import location from './modules/location';
import alerts from './modules/alerts';
import loading from './modules/loading';

Vue.use(Vuex);

const store = {
  modules: {
    location,
    account,
    observation,
    observe,
    explore,
    alerts,
    loading,
  },
};

const storeInstance = new Vuex.Store(store);
export default storeInstance;
