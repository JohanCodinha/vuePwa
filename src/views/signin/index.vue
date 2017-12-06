<template>
  <div class="container">
    <div class="instruction">
      <img src="../../assets/Environment.svg">
      <h1>Let's get started</h1>
      <h2>Enter your VBA credentials to log in.</h2>
    </div>
    <form @submit.prevent="login">
      <div class="form-block">
        <label for="signin-username">
          Username
        </label>
        <div class="text-input">
          <input id="signin-username" v-model="username" type="text" name="username"
            autocapitalize="none" spellcheck="false">
        </div>
      </div>
      <div class="form-block">
        <label for="signin-password">
          Password
        </label>
        <div class="text-input">
          <input id="signin-password" v-model="password" type="password"
            autocapitalize="none" spellcheck="false" >
        </div>
      </div>
      <div class="action">
        <input type="submit" name="" value="Log in" class="button">
      </div>
    </form>
      <p>{{status}}</p>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
// import { mapGetters } from 'vuex';

const {
  mapActions: mapActionsAccount,
  mapGetters: mapGettersAccount,
} = createNamespacedHelpers('account');

export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
    };
  },
  computed: {
    ...mapGettersAccount([
      'status',
      'isLogin',
    ]),
  },
  methods: {
    ...mapActionsAccount([
      'fetchToken',
      'updateToken',
    ]),
    async login () {
      try {
        await this.fetchToken({
          username: this.username,
          password: this.password });
        if (this.isLogin) {
          this.$store.dispatch('observation/getGeneralObs');
          this.$router.push({ name: 'observations' });
        } else {
          this.password = '';
        }
      } catch (error) {
        console.log(this);
        this.$store.dispatch('alerts/addSnackbar', { message: error.message, timeout: 20000 }, { root: true });
        console.log(error);
      }
    },
  },
  mounted: function mounted () {
    // this.updateToken();
  },
};
</script>

<style lang="scss" scoped>

h1 {
  font-size: 1.8rem;
}

h2 {
  margin-top: .2rem;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 .5rem 0 .5rem;
}

.instruction {
  text-align: center;
  margin-top: 1rem;
  img {
    max-width: 25vw; 
    @media screen and (min-width:768px) {
      max-width: 15rem; 
    }
  }
}

form {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-block {
  margin-bottom: 1rem;
}

.text-input {
  width: 100%;
  position: relative;
  display: block;
  background-color: #d2d6df;
  border-radius: 2px;
  box-sizing: border-box;
  padding: 1px;
  outline: none;
  color: #45494e;
  font-size: 1.2rem;
}

.text-input input {
  font-size: 1.2rem;
  display: block;
  width: 100%;
  height: 100%;
  padding: 8px 12px 9px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 2px;
  outline: none;
  border: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  -webkit-appearance: none;
}

.action {
  display: flex;
  justify-content: center;
}

.button {
  font-size: 1.3rem;
}

</style>
