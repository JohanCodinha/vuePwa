<template>
  <div id="app">
    <header 
     :class="{ slideLeft: slideoutOpen }">
     <snackbar></snackbar>
      <div class="header-container"
           :class="{ 'sticky-header': !activeRoute }">
        <div  class="header-container-left"
              :class="{ 'standalone': standalone }"
              v-if="displayBackArrow"
              @click="backArrow">
          <i class="material-icons">arrow_back</i>
          <p class="header-back-route" >{{backButtonText}}</p>
        </div>
        <img v-if="!displayBackArrow" class="logo" src="./assets/logo-delwp.png">
        <div class="header-container-right">
          <div class="online-status" v-if="!onLine">
            <i class="material-icons">signal_wifi_off</i>
            <p>Offline</p>
          </div>
          <a @click="menu" class="header-menu-burger">
            <div class="menu-burger-box">
              <div class="menu-burger-inner"
                   :class="{
                   'menu-burger-inner-active': slideoutOpen,
                   'menu-burger-inner-active': slideoutOpen,
                   }">
              </div>
            </div>
          </a>
        </div>
      </div>
      <head-nav v-if="activeRoute" :activeRoute="activeRoute" 
        :class="{ 'sticky-nav': hideTop }" 
        class="bottom-nav"></head-nav>
    </header>
      <router-view
        :style="{ 'padding-top': activeRoute ? '6.25rem !important' : '3.125rem !important' }"
        :class="{ slideLeft: slideoutOpen }"
        class="main app-content">
      </router-view>
    <sidePanel :style="{ display: slideoutOpen ? 'block' : 'none' }" @closeMenu="menu"></sidePanel>
    <loading-indicator></loading-indicator>
  </div>
</template>

<script>
import sidePanel from '@/views/sidePanel';
import navigation from '@/views/navigation';
import snackbar from '@/views/components/snackbar';
import loading from '@/views/loading';
import { debounce } from 'lodash';
import { mapActions, mapGetters, createNamespacedHelpers } from 'vuex';

const {
  mapActions: mapActionsAccount,
  mapGetters: mapGettersAccount,
} = createNamespacedHelpers('account');

export default {
  name: 'index-component',
  data () {
    return {
      slideoutOpen: false,
      scrollPosition: 0,
    };
  },
  components: {
    sidePanel,
    'head-nav': navigation,
    snackbar,
    'loading-indicator': loading,
  },
  computed: {
    ...mapGetters({
      observations: 'observation/generalObs',
    }),
    ...mapGettersAccount([
      'isLogin',
      'onLine',
    ]),
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
    hideTop () {
      return this.scrollPosition > 55;
    },
    displayBackArrow () {
      switch (this.$route.path) {
        case '/':
        case '/about':
        case '/observations':
        case '/observations/drafts':
        case '/explore':
          return false;
        default:
          return this.$route;
      }
    },
    backButtonText () {
      console.log(this.$route.name);
      switch (this.$route.name) {
        case '':
        case 'SpeciePicker':
        case 'LocationPicker':
          return 'Observation';
        case 'GeneralObs':
        case 'Signin':
          return 'Observations';
        case '/explore':
          return this.$route.name;
        default:
          return '';
      }
    },
    standalone () {
      return window.navigator.standalone === true;
    },
  },
  methods: {
    ...mapActions({
      loadObservation: 'observe/loadObservation',
      getGeneralObs: 'observation/getGeneralObs',
    }),
    ...mapActionsAccount([
      'updateToken',
      'updateOnlineStatus',
    ]),
    menu () {
      this.slideoutOpen = !this.slideoutOpen;
    },
    backArrow () {
      if (/generalOb/g.test(this.$route.path)) {
        console.log('going back to draft obs');
        return this.$router.push({ name: 'draftObservations' });
      }
      return this.$router.go(-1);
    },
    updateScroll () {
      this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    },
  },
  mounted: async function mounted () {
    window.top.scrollTo(0, 1);
    const vm = this;
    window.addEventListener('load', () => {
      vm.updateOnlineStatus();
      window.addEventListener('online', vm.updateOnlineStatus);
      window.addEventListener('offline', vm.updateOnlineStatus);
      window.addEventListener('scroll', debounce(vm.updateScroll, 15), true);
    });
    this.loadObservation();
    this.updateToken();
  },
  watch: {
    isLogin: function refreshOnLogin (value) {
      if (value && !this.observations.length) {
        this.getGeneralObs();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'vic';
  src: 
    url('./assets/fonts/hinted-VIC-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'vic';
  src: 
    url('./assets/fonts/hinted-VIC-Bold.woff2') format('woff2'),
    url('./assets/fonts/hinted-VIC-SemiBold.woff2')  format('woff2'),
    url('./assets/fonts/hinted-VIC-Medium.woff2') format('woff2');
  font-weight: 700;
  font-style: bold;
}

@font-face {
  font-family: 'vic';
  src: 
    url('./assets/fonts/hinted-VIC-Medium.woff2') format('woff2'),
    url('./assets/fonts/hinted-VIC-SemiBold.woff2')  format('woff2');
  font-weight: 500;
  font-style: medium;
}

.standalone {
  padding-top: 20px;
  padding-bottom: 20px;
}

#app {
  font-family: 'vic', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  position: absolute;
  width: 100%;
}

header {
  background-color: #201647;
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  z-index: 10;
  transition: transform 300ms ease;
}

.header-menu-background {
  bottom: 0;
  left: 0;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 0;
}

.header-menu-background::before {
  border-color: transparent transparent #00b7bd transparent;
  border-style: solid;
  border-width: 0 12.5rem 26.25rem 12.5rem;
  content: '';
  height: 100%;
  position: absolute;
  right: -20.625rem;
  top: -26.125rem
}

.slideLeft {
  transition: transform 300ms ease;
}

.displayMenu {
  display: block;
}

.header-container {
  min-height: 3.125rem;
  padding-left: .5rem;
  padding-right: .5rem;
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
  // background: linear-gradient(45deg, rgba(0,178,169,1) 0%, rgba(0,178,169,1) 38%, rgba(32,21,71,1) 88%, rgba(32,21,71,1) 100%);
  background: linear-gradient(45deg, #00796B 0%, #00796B 38%, #4B30AB 88%, #4B30AB 100%);
}

.header-container-left {
  display: flex;
  flex: 1;
  align-items: center;
}

.header-menu-burger {
  background: transparent;
  border: 0;
  color: inherit;
  cursor: pointer;
  display: inline-block;
  line-height: 0;
  margin: 0;
  padding: 0.5rem;
  position: relative;
}

.menu-burger-box {
  display: inline-block;
  height: 0.875rem;
  position: relative;
  width: 1.25rem;
}

.menu-burger-inner {
  transition: all 0.35s ease;
  background: white;
  display: block;
  height: 0.125rem;
  position: absolute;
  top: 0.375rem;
  width: 1.25rem;
}

.menu-burger-inner-active {
  background: white;
  width: 0;
}

.menu-burger-inner::before {
  bottom: 0.375rem;
  width: 1.25rem;
}

.menu-burger-inner-active::before {
  transform: rotate(45deg) translate3d(0.21875rem, 0.28125rem, 0);
  width: 1.375rem;
}

.menu-burger-inner::after {
  top: 0.375rem;
  width: 0.9375rem;
}

.menu-burger-inner-active::after {
  transform: rotate(-45deg) translate3d(0.21875rem, -0.3125rem, 0);
  width: 1.375rem;
}

.menu-burger-inner::before,
.menu-burger-inner::after {
  -webkit-transition: all 0.15s ease;
  -moz-transition: all 0.15s ease;
  transition: all 0.15s ease;
  background: white;
  content: '';
  display: block;
  height: 0.125rem;
  position: absolute;
}

.logo img {
  max-height: 100%;
}

.logo {
  padding-left: .5rem;
  height: 2.125rem;
}
.main {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  position: relative;
}

.app-content {
  flex: 1;
}

.sticky-nav {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
}

.btn {
  text-decoration: none;
  color: #fff;
  background-color: #26a69a;
  text-align: center;
  letter-spacing: .5px;
  border: none;
  border-radius: 2px;
  display: inline-block;
  height: 36px;
  line-height: 36px;
  padding: 0 2rem;
  text-transform: uppercase;
}

.material-icons {
  color: white;
  margin-left: 1rem;
}

.header-back-route {
  color: white;
  font-size: 1.5rem;
  margin-left: 1rem;
}

.header-container-right {
  display: flex;
  justify-content: center;
  align-items: center;
  .online-status {
    margin-right: 2.5rem;
    color: #f5f5f5;
    font-size: .8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    i {
      margin: 0;
    }
  }
}

.hideTop {
  position: fixed;
  width: 100%;
  top: 0;
  transform: translateY(-50%);
}

.overflow {
  overflow: auto;
}

.slideLeft {
  transform: translateX(-268px);
}
.sticky-header{
  position: fixed;
  width: 100%;
}
</style>

