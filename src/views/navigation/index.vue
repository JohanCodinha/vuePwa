<template>
  <nav class="navigation">
    <router-link class="router-link" :class="{ current: activeRoute === 'explore'}" to="/explore">
      <i class="material-icons">explore</i>
      <p>explore</p>
    </router-link>
    <router-link class="router-link" :class="{ current: activeRoute === 'observations'}" to="/observations">
      <i class="material-icons">assignment</i>
      <p>saved</p>
    </router-link>
    <router-link class="router-link" :class="{ current: activeRoute === 'drafts'}" to="/observations/drafts">
      <i class="material-icons">photo_camera</i>
      <p>observe</p>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'bottomNav',
  data () {
    return {
    };
  },
  props: ['activeRoute'],
  computed: {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
nav {
  font-size: 2rem;
  display: flex;
  align-items: center;
  height: 3.125rem;
  max-height: 5rem;
  background-color: #201647;
  background: linear-gradient(135deg, rgb(0, 178, 169) 0%, rgb(0, 178, 169) 38%, rgb(32, 21, 71) 88%, rgb(32, 21, 71) 100%);
  box-shadow: 0 0 4px rgba(0,0,0,0.12), 0 4px 4px rgba(0,0,0,0.24);
  flex: 1;
  justify-content: space-around;
  padding-top: .5rem;
}

.router-link {
  display: flex;
  height: 100%;
  flex: 1;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  p {
    font-weight: 500;
    font-size: 1rem;
    text-transform: capitalize;
  }
}
.material-icons {
  font-size: 1.5rem;
}

.current {
  color: white;
  border-bottom: 2px solid white;
}

</style>
