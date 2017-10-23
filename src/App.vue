<template>
  <div id="app">
    <div class="main slideLeft" 
         :style="{ transform: slideoutOpen ? 'translateX(-268px)' : 'translateX(0px)' }">
      <header>
        <div class="header-menu-background"></div>
        <div class="header-container">
          <div class="header-container-left" v-if="displayBackArrow" @click="backArrow">
            <i class="material-icons">arrow_back</i>
            <p class="header-back-route" >{{backButtonText}}</p>
          </div>
          <img v-if="!displayBackArrow" class="logo" src="./assets/logo-delwp.png">
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
      </header>
      <router-view class="app-content"></router-view>
    </div>
    <bottomNav :style="{ transform: slideoutOpen ? 'translateX(-268px)' : 'translateX(0px)' }" class="bottom-nav slideLeft"></bottomNav>
    <sidePanel :style="{ display: slideoutOpen ? 'block' : 'none' }" @closeMenu="menu"></sidePanel>
  </div>
  </div>
</template>

<script>
import sidePanel from '@/views/sidePanel';
import bottomNav from '@/views/bottomNav';
import { mapActions, createNamespacedHelpers } from 'vuex';

const {
  mapActions: mapActionsAccount,
  mapGetters: mapGettersAccount,
} = createNamespacedHelpers('account');

export default {
  name: 'index-component',
  data () {
    return {
      slideoutOpen: false,
    };
  },
  components: {
    sidePanel,
    bottomNav,
  },
  computed: {
    ...mapGettersAccount([
      'isLogin',
    ]),
    displayBackArrow () {
      switch (this.$route.path) {
        case '/':
        case '/observations':
        case '/observations/drafts':
        case '/explore':
          return false;
          // break;
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
  },
  methods: {
    ...mapActions({
      loadObservation: 'observe/loadObservation',
      getGeneralObs: 'observation/getGeneralObs',
    }),
    ...mapActionsAccount([
      'updateToken',
    ]),
    menu () {
      this.slideoutOpen = !this.slideoutOpen;
    },
    backArrow () {
      console.log('backarrow');
      this.$router.go(-1);
    },
  },
  mounted: function mounted () {
    this.updateToken();
    this.loadObservation();
  },
  watch: {
    isLogin: function refreshOnLogin () {
      this.getGeneralObs();
    },
  },
};
</script>

<style scoped>
@font-face {
  font-family: 'delwp';
  src: url('./assets/fonts/hinted-VIC-Regular.woff2') format('woff2');
  /*url('../assets/fonts/ratio.woff') format('woff'),*/
  /*url('../assets/fonts/ratio.ttf') format('truetype');*/
  font-weight: normal;
  font-style: normal;
}

#app {
  font-family: 'delwp', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

header {
  background-color: #201647;
  min-height: 3.125rem;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 10;
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
  padding-left: .5rem;
  padding-right: .5rem;
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
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
  background: #201647;
  display: block;
  height: 0.125rem;
  position: absolute;
  top: 0.375rem;
  width: 1.25rem;
}

.menu-burger-inner-active {
  background: #00b7bd;
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
  background: #201647;
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
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
  position: relative;
}

.app-content {
  flex: 1;
  overflow: auto;
  // margin-bottom: 3rem;

}
.bottom-nav {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 800;
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
</style>
