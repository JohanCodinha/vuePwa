<template>
  <transition name="slide-up">
    <div v-if="spinner" class="spinner-container">
      <svg class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
      </svg>
    </div>
  </transition>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const {
  mapGetters: mapGettersLoading,
} = createNamespacedHelpers('loading');

export default {
  name: 'loading',
  computed: {
    ...mapGettersLoading([
      'spinner',
    ]),
  },
};
</script>

<style lang="scss" scoped>

$offset: 187;
$duration: 1.4s;

.spinner {
  animation: rotator $duration linear infinite;
}

.spinner-container {
  border-radius: 100%;
  background-color: white;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  padding: .5rem;
  width: 4rem;
  height: 4rem;
  position: fixed;
  z-index: 3;
  bottom: 1rem;
  right: 50%;
  margin-right: -2.5rem;
}

@keyframes rotator {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(270deg); }
}

.path {
  stroke-dasharray: $offset;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation:
  dash $duration ease-in-out infinite, 
  colors ($duration*4) ease-in-out infinite;
}

@keyframes colors {
  0% { stroke: #642667; }
  33% { stroke: #CEDC00; }
  66% { stroke: #71C5E8; }
  100% { stroke: #FDDA24; }
}

@keyframes dash {
  0% { stroke-dashoffset: $offset; }
  50% {
    stroke-dashoffset: $offset/4;
    transform:rotate(135deg);
  }
  100% {
    stroke-dashoffset: $offset;
    transform:rotate(450deg);
  }
}

.slide-up-enter-active {
  transition: all .3s ease;
}
.slide-up-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-up-enter, .slide-up-leave-to {
  opacity: .5;
  transform: translateY(200%);
}
</style>
