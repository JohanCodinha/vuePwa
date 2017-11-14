<template>
  <footer v-if="activeRoute"class="bottom-nav">
    <div class="navigation">
      <router-link to="/explore">
        <i class="material-icons"
          :class="{ current: activeRoute === 'explore'}">explore</i>
      </router-link>
      <router-link to="/observations">
        <i class="material-icons"
          :class="{ current: activeRoute === 'observations'}">assignment</i>
      </router-link>
      <router-link to="/observations/drafts">
        <i class="material-icons"
          :class="{ current: activeRoute === 'drafts'}">note_add</i>
      </router-link>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'bottomNav',
  data () {
    return {
    };
  },
  computed: {
    activeRoute () {
      const route = this.$store.state.route.path;
      switch (route) {
        case '/observations':
          return 'observations';
        case '/observations/drafts':
          return 'drafts';
        case '/explore':
          return 'explore';
        default:
          return null;
      }
    },
  },
  methods: {
  },
};
</script>

<style scoped>
.bottom-nav {
  font-size: 2rem;
  display: flex;
  align-items: center;
  height: 3rem;
  max-height: 5rem;
  background-color: #201647;
  box-shadow: 
    0 -2px 2px 0 rgba(0,0,0,0.14),
    0 -1px 5px 0 rgba(0,0,0,0.12),
    0 -3px 1px -2px rgba(0,0,0,0.2);
}

.navigation {
  display: flex;
  justify-content: space-around;
  flex: 1;
}

.material-icons {
  color: rgba(255, 255, 255, 0.67);
  font-size: 2rem;
}

.current {
  color: #00B7BD;
}

</style>
