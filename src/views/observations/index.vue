<template>
  <div :class="{ center: (logedIn && generalObs.length < 1)}" class="container">
  <div class="no-obs" v-if="logedIn && generalObs.length < 1">
    <p>No observation</p>
    <router-link to='/observations/drafts'>
      let's get started
    </router-link>
  </div>
  <div class="loggedOut" v-if="!logedIn">
    <h1>
      <router-link class="link" :to="{ name: 'Signin'}">Sign in</router-link>
      to the Victorian Biodiversity Atlas to see your observations
    </h1>
  </div>
    <h1 v-if="generalObs.length > 0">{{generalObs.length}} saved observations</h1>
    <ul>
      <observation-card v-for="record in generalObs"
        :scientificName="record.species && record.species.length && record.species[0].scientificNme"
        :commonName="record.species && record.species.length && record.species[0].commonNme"
        :imagesId="record.species[0] && record.species[0].images.map(i=>i.id)"
        :siteName="record.siteNme"
        :surveyId="record.surveyId"
        :status="record.expertReviewStatusCde"
        :startDate="record.surveyStartSdt"
        :key="record.surveyId">
      </observation-card>
    </ul>
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
    obsByDate () {
      const observations = this.generalObs;
      return observations.sort((a, b) => new Date(b.surveyStartSdt) - new Date(a.surveyStartSdt));
    },
  },
  methods: {
    ...mapActions({
      getGeneralObs: 'observation/getGeneralObs',
    }),
    editObservation (obsId) {
      this.$router.push({ name: 'GeneralObs', params: { observationId: obsId } });
    },
    deleteRecord (surveyId) {
      this.$store.dispatch('observation/deleteSurvey', surveyId);
    },
  },
};
</script>

<style scoped>
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
</style>
