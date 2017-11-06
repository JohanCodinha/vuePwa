<template>
  <div class="loggedOut">
    <img src="../../assets/Environment.svg">
    <h1>Vba Go</h1>
    <div>
      <p>
        Share your observations,
      </p>
      <p>
        Improve our common knowledge
      </p>
      <p>
        of Victoria’s natural environment.
      </p>
    </div>
    <router-link class="link" :to="startLink">
      <button class="button" >START</button>
    </router-link>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
// import { mapGetters } from 'vuex';

const {
  mapGetters: mapGettersAccount,
} = createNamespacedHelpers('account');

export default {
  name: 'saved-observations',

  computed: {
    ...mapGettersAccount([
      'isLogin',
    ]),
    startLink () {
      return this.isLogin
        ? { name: 'Observations' }
        : { name: 'Signin' };
    },
  },
};
</script>

<style lang="scss" scoped>
  .container {
    margin: 0 .5rem 0 .5rem;
    padding-bottom: .5rem;
    display: flex;
    flex-direction: column;
    margin-bottom: 3rem;
  }

  h1 {
    font-size: 1rem;
    margin: .5rem .5rem 0 .5rem;
  }

  .loggedOut {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    div {
      margin: 1rem 0 1rem 0 
    }
    img {
      max-width: 25vw;
    }

    h1 {
      color: black;
      font-size: 2rem;
    }

    .button {
      display: inline-block;
      font-size: 1.2rem;
    }
  }

  .link {
    color: #00b7bd;
    text-decoration: underline;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
  }
</style>
