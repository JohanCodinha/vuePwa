<template>
  <div :class="{ center: (logedIn && generalObs.length < 1)}" class="container">
    <div class="no-obs" v-if="logedIn && generalObs.length < 1">
      <p>No observation</p>
      <router-link to='/observations/drafts'>
        let's get started
      </router-link>
    </div>
    <div v-if="generalObs.length > 0" class="menu">
      <h1 class="menu-item" >{{generalObs.length}} saved observations</h1>
      <i @click="refresh" class="material-icons menu-item">refresh</i>
    </div>
    <div>
    <ul class="observationsList">
      <observation-card class="observationCard"
        v-for="record in observationsByDate"
        :scientificName="record.species && record.species.length && record.species[0].scientificNme"
        :commonName="record.species && record.species.length && record.species[0].commonNme"
        :imagesId="record.species[0] && record.species[0].images.map(i=>i.id)"
        :siteName="record.siteNme"
        :surveyId="record.surveyId"
        :status="record.expertReviewStatus"
        :startDate="record.surveyStartSdt"
        :key="record.surveyId">
      </observation-card>
    </ul>
    </div>
  </div>
</template>

<script>
// import { createNamespacedHelpers } from 'vuex';
import { mapGetters, mapActions } from 'vuex';
import observationCard from './obsCard';

// const { mapActions, mapGetters } = createNamespacedHelpers('observation');

export default {
  name: 'saved-observations',
  data () {
    return {
    };
  },
  components: {
    'observation-card': observationCard,
  },
  computed: {
    ...mapGetters({
      observationsByDate: 'observation/observationsByDate',
      generalObs: 'observation/general',
      logedIn: 'account/isLogin',
    }),
  },
  methods: {
    ...mapActions({
      getGeneralObs: 'observation/getGeneralObs',
    }),
    refresh () {
      this.getGeneralObs();
    },
    editObservation (obsId) {
      this.$router.push({ name: 'GeneralObs', params: { observationId: obsId } });
    },
    deleteRecord (surveyId) {
      this.$store.dispatch('observation/deleteSurvey', surveyId);
    },
  },
};
</script>

<style lang="scss" scoped>
  .observationsList {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .container {
    margin: 0 .5rem 0 .5rem;
    padding-bottom: .5rem;
    display: flex;
    flex-direction: column;
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

  .center {
    align-items: center;
    justify-content: center;
  }

  .no-obs {
    font-size: 1.8rem;
  }

  .observationCard  {
    width: 49%;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    margin: .1rem;
    @media screen and (max-width:320px) {
      width: 100%; 
    }
    @media screen and (min-width:768px) {
      width: 32%; 
    }
    @media screen and (min-width:1024px) {
      width: 24.5%; 
    }
  }

  .menu {
    display: flex;
    min-height: 2rem;
    margin: .5rem;
    justify-content: space-between;
    .menu-item {
      display: flex;
      justify-content: center;
      align-items: center;

    }
  }
</style>
