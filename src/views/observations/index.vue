<template>
  <div :class="{ center: (isLogin && generalObs.length < 1)}" class="container">
  <div class="no-obs" v-if="isLogin && generalObs.length < 1">
    <p>No observation</p>
    <router-link to='/observations/drafts'>
      let's get started
    </router-link>
  </div>
  <div class="loggedOut" v-if="!isLogin">
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
        :siteName="record.siteNme"
        :surveyId="record.surveyId"
        :status="record.expertReviewStatusCde"
        :startDate="record.surveyStartSdt"
        :key="record.surveyId"></observation-card>
    </ul>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import observationCard from './obsCard';

const {
  mapActions: mapActionsObservation,
  mapGetters: mapGettersObservation,
} = createNamespacedHelpers('observation');
const {
  // mapActions: mapActionsAccount,
  mapGetters: mapGettersAccount,
} = createNamespacedHelpers('account');
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
    ...mapGettersAccount([
      'isLogin',
    ]),
    ...mapGettersObservation({
      generalObs: 'general',
    }),
  },
  methods: {
    ...mapActionsObservation([
      'getGeneralObs',
      'deleteSurvey',
    ]),
    editObservation (obsId) {
      this.$router.push({ name: 'GeneralObs', params: { observationId: obsId } });
    },
    deleteRecord (surveyId) {
      this.deleteSurvey(surveyId);
    },
  },
  watch: {
    isLogin: function isLoginWatcher () {
      this.getGeneralObs();
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
}

h1 {
  margin: 1rem;
  font-size: 1.8rem
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
