<template>
  <div class="container">
    <record-images
      v-if="imageId"
     :imageId="imageId">
    </record-images>
    <record-species
       :commonName="specie && specie.commonNme"
       :scientificName="specie && specie.scientificNme"
       :observer="specie && specie.observerFullName"
       :type="specie && specie.typeDesc"
       :count="specie && specie.totalCountInt"
       :countAccuracy="specie && specie.countAccuracy"
       :reliability="specie && specie.reliabilityDesc"
       :comments="comments"
       >
    </record-species>
    <record-location v-if="longitude && latitude"
      :latitude="latitude"
      :longitude="longitude"
    ></record-location>
  </div>
</template>

<script>
import { get } from 'lodash';
import { mapGetters } from 'vuex';
import species from './species';
import images from './images';
import location from './location';

export default {
  name: 'record-details',
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
      type: [Number, String],
      required: true,
      default () { return undefined; },
    },
  },
  computed: {
    ...mapGetters({
      observations: 'observation/generalObs',
      recordById: 'observation/recordById',
    }),
    survey () {
      const coercedSurveyId = Number(this.surveyId);
      return this.observations.find(obs => obs.surveyId === coercedSurveyId);
    },
    species () {
      return get(this.survey, 'species', null);
    },
    imageId () {
      return get(this.record, 'images', []).map(i => i.id)[0];
    },
    specie () {
      return get(this.survey, 'species[0]', null);
    },
    recordId () {
      return get(this.specie, 'id');
    },
    record () {
      const id = this.recordId;
      return this.recordById(id);
    },
    latitude () {
      return get(this.record, 'surveyComponent.survey.site.latitudeddNum', null);
    },
    longitude () {
      return get(this.record, 'surveyComponent.survey.site.longitudeddNum', null);
    },
    comments () {
      return get(this.record, 'trCommentTxt', null);
    },
  },
  methods: {
    // ...mapActions([
    // ]),
  },
  mounted () {
    // this.$store.dispatch('observation/getRecord', this.specie.id);
  },
};
</script>

<style scoped>

a {
  color: #42b983;
}

.container {
  display: flex;
  flex-direction: column;
}
</style>
