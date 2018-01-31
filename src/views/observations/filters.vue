<template>
  <div v-if="generalObs.length > 0" class="menu">
    <p class="menu-item" >{{generalObs.length}} saved observations</p>
    <i @click="refresh" class="material-icons menu-item">refresh</i>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'filtering-options',
  props: {
  },
  computed: {
    ...mapGetters({
      generalObs: 'observation/generalObs',
    }),
  },
  methods: {
    ...mapActions({
      getGeneralObs: 'observation/getGeneralObs',
    }),
    refresh () {
      this.getGeneralObs();
    },
  },
};
</script>

<style lang="scss">
 .menu {
    background-color: #00b2a9;
    display: flex;
    min-height: 2rem;
    justify-content: space-between;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.12), 0 4px 4px rgba(0, 0, 0, 0.24);
    padding: 1rem;
    color: white;
    .menu-item {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
