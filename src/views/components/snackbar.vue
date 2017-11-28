<template>
  <transition name="slide-fade">
    <div v-if="snackbar" :class="{ visible: isVisible}" class="snackbar">
      <div class="container">
        <p>{{message }}</p> 
        <button @click="close">
          <span>CLOSE</span>
        </button> 
      </div>
    </div>
  </transition>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const {
  mapActions: mapActionsAlerts,
  mapGetters: mapGettersAlerts,
} = createNamespacedHelpers('alerts');

export default {
  name: 'snackbar',
  components: {
  },
  data () {
    return {
      isVisible: true,
    };
  },
  computed: {
    ...mapGettersAlerts([
      'snackbar',
    ]),
    message () {
      return this.snackbar.message || '';
    },
  },
  methods: {
    ...mapActionsAlerts([
      'deleteSnackbar',
    ]),
    close () {
      this.isVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.snackbar {
  position: absolute;
  background: #323232;
  color: white;
  width: 100%;
  z-index: 3;
  top: 0;
  bottom: 0;
  right: 0;
  transform: translateY(-100%);
  .container {
    display: flex;
    justify-content: space-between;
    margin: 0 1rem 0 1rem;
    align-items: center;
    height: 100%;
    padding: .3rem;
    box-sizing: border-box;  
  }
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: .5rem;
  }
  button {
    border: none;
    background: none !important;
    color: #39efde;
    padding: 0! important;
    font: inherit;
    cursor: pointer;
    font-size: 1.2rem;
    outline: inherit !important;
    span {
      text-transform: uppercase;
    } 
  }
}
.visible {
  transform: translateY(0%);
}

.slide-fade-enter-active {
  transition: all .3s ease;
  transform: translateY(0%);
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  opacity: .5;
  transform: translateY(-100%);
}
</style>
