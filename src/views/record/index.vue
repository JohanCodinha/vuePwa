<template>
  <div class="container">
    <record-images
     :imagesId="specie.images.map(i=>i.id)">
    </record-images>
    <record-species
       :commonName="specie.commonNme"
       :scientificName="specie.scientificNme"
       :observer="specie.observerFullName"
       :type="specie.typeDesc"
       :count="specie.totalCountInt"
       :countAccuracy="specie.countAccuracyCde"
       :reliability="specie.reliabilityDesc"
       :comments="'Insert comment'"
       >
    </record-species>
    <record-location></record-location>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import species from './species';
import images from './images';
import location from './location';

export default {
  name: 'record',
  data () {
    return {
    };
  },
  components: {
    'record-species': species,
    'record-location': location,
    'record-images': images,
  },
  props: {
    surveyId: {
      type: Number,
      default () { return undefined; },
    },
  },
  computed: {
    ...mapGetters({
      observations: 'observation/generalObs',
    }),
    survey () {
      return this.observations.find(obs => obs.surveyId === this.surveyId);
    },
    species () {
      return this.survey.species;
    },
    specie () {
      return this.survey.species[0];
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
