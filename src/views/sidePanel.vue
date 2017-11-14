<template>
  <div class="slideout-menu">
    <div class="content">
      <ul>
        <li>
          <p v-if="displayName">{{displayName}}</p>
          <router-link v-if="isLogin " @click.native="logoutClick" :to="{ name: 'Signin'}">Sign out</router-link>
          <router-link v-else @click.native="closeMenu" :to="{ name: 'Signin'}">Sign in</router-link>
        </li>
        <li>
          <a href="mailto:vbago.feedback@gmail.com">Leave Feedback</a>
        </li>
        <li class="unavailable">
          <a href="#">Settings</a>
        </li>
        <li class="unavailable">
          <a href="#">About</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const {
  mapGetters: mapGettersAccount,
  mapActions: mapActionsAccount,
} = createNamespacedHelpers('account');

export default {
  name: 'sidePanel',
  data () {
    return {
    };
  },
  computed: {
    ...mapGettersAccount([
      'isLogin',
      'displayName',
    ]),
  },
  methods: {
    ...mapActionsAccount([
      'logout',
    ]),
    closeMenu () {
      console.log('close');
      this.$emit('closeMenu');
    },
    logoutClick () {
      this.logout();
      this.$emit('closeMenu');
    },
  },
};
</script>

<style scoped>

li {
  font-size: 1.125rem;
  font-weight: 600;
}

li::after {
  background: rgba(32, 22, 71, 0.3);
  bottom: 0;
  content: '';
  height: 0.0625rem;
  display: block;
  width: 90%;
}

li a {
  color: #201547;
  display: block;
  padding: 0.8125rem 4rem 0.75rem 0.875rem;
  margin: .5rem 0 .5rem 0;
  text-decoration: none;
}

.slideout-menu {
  -webkit-overflow-scrolling: touch;
  bottom: 0;
  left: auto;
  overflow-y: auto;
  position: fixed;
  right: 0;
  top: 0;
  width: 268px;
  z-index: 1;
  background: white;
}

.slideout-menu::before {
  background: #00b7bd;
  content: '';
  display: block;
  height: 3.125rem;
  width: 100%;
}

.content { 
  padding: 1rem;
}

.content-text {
  margin-left: .5rem;
}

.unavailable > a {
  color: #9894a8;
}

</style>
