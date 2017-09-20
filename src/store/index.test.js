/* eslint-disable */
import store from '../store';

describe('Modules should be namespaced', () => {
  test('Account is accesible', () => {
    //console.log(store)
    expect(store.getters['account/status']).toBe(null);
  });
  
  test('Explore is accesible',() => {
    
  });
})

