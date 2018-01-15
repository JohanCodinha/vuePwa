<template>
  <div class="spinner-container">
    <svg class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
     <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'templateComponent',
  props: {
  },
  computed: {
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
  0% { stroke: #4285F4; }
  25% { stroke: #DE3E35; }
  50% { stroke: #F7C223; }
  75% { stroke: #1B9A59; }
  100% { stroke: #4285F4; }
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
</style>
