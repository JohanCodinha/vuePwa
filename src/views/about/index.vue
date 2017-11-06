<template>
  <div class="container">
    <div class="hero">
      <img src="../../assets/Environment.svg">
      <h1>Vba Go</h1>
    </div>
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
        ? { name: 'observations' }
        : { name: 'Signin' };
    },
  },
};
</script>

<style lang="scss" scoped>

  h1 {
    margin: .5rem .5rem 0 .5rem;
  }

  .container {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 10vh;
    div {
      margin: 1rem 0 1rem 0;
      font-size: 5vw;
      @media screen and (min-width:1024px) {
        font-size: 2rem;
      }
    }
    img {
      max-width: 25vw;
      @media screen and (min-width:1024px) {
        max-width: 15rem;
      }
    }

    h1 {
      color: black;
      font-size: 10vw;
      @media screen and (min-width:1024px) {
        font-size: 6.5rem;
      }
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
