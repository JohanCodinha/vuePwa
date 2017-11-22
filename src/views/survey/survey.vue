<template>
  <div class="container">
    <!-- <p>Survey: {{this.surveyId}}</p> -->
    <h1 v-if="species && !species.length">No species found for survey {{surveyId}}</h1>
    <ul>
      <specie-card v-for="specie in species"
        :commonName="specie.commonNme"
        :scientificName="specie.scientificNme"
        :count="specie.totalCountInt"
        :imagesId="specie.images.map(i=>i.id)"
        :status="specie.reliabilityDesc"
        :extraDescription="specie.extraDesc"
        :siteName="survey.siteNme"
        :key="specie.surveyId">
      </specie-card> 
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import specieCard from './specieCard';

export default {
  name: 'observation-card',
  data () {
    return {
    };
  },
  components: {
    'specie-card': specieCard,
  },
  props: {
    surveyId: {
      type: Number,
      default () { return undefined; },
    },
  },
  computed: {
    ...mapGetters({
      observations: 'observation/general',
    }),
    survey () {
      return this.observations.find(obs => obs.surveyId === this.surveyId);
    },
    species () {
      return this.survey.species;
    },
  },
  methods: {
    // ...mapActions([
    // ]),
  },
  mounted () {
    // this.$store.dispatch('observation/getSurveySpecies', this.surveyId);
  },
};
</script>

<style scoped>

a {
  color: #42b983;
}

.container {
  margin: .5rem;
  display: flex;
  flex-direction: column;
}
</style>
