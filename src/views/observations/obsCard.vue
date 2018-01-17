<template>
  <card @click.native="$router.push({ name: 'record', params: { surveyId } })"
    :triggerReveal="triggerReveal">
    <img v-if="imageSources" slot="image" :src="imageSources">
    <dl slot="content">
      <div class="content">
        <div class="description">
          <dt v-if="commonName || scientificName">Species</dt>
          <dd>{{commonName || scientificName}}</dd>
          <dt>Site name</dt>
          <dd>{{siteName}}</dd>
          <dt>Date</dt>
          <dd>{{formatedDate}}</dd>
          <dt>Status</dt>
          <dd>{{status}}</dd>
        </div>
      </div>
    </dl>
    <div slot="reveal">
      <a class="btn red_"
         @click.stop='deleteRecord(surveyId)'>Delete
      </a>
      <a class="btn"
         @click.stop='expertReview(surveyId)'>Review
      </a>
    </div>
  </card>
</template>

<script>
import card from '@/views/components/card';

export default {
  name: 'observation-card',
  components: {
    card,
  },
  data () {
    return {
      triggerReveal: false,
    };
  },
  props: {
    siteName: {
      type: String,
      default () { return undefined; },
    },
    imagesId: {
      type: Array,
      default () { return null; },
    },
    status: {
      type: String,
      default () { return undefined; },
    },
    surveyId: {
      type: Number,
      default () { return undefined; },
    },
    commonName: {
      // type: String,
      default () { return undefined; },
    },
    scientificName: {
      // type: String,
      default () { return ''; },
    },
    startDate: {
      type: String,
      default () { return undefined; },
    },
  },
  computed: {
    formatedDate () {
      const date = new Date(this.startDate);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    },
    imageSources () {
      if (!this.imagesId || !this.imagesId.length) return null;
      return this.imagesId.map(id => `https://res.cloudinary.com/vba/image/fetch/w_300,f_auto/https://vba.dse.vic.gov.au/vba/getFile.do%3Fid%3D${id}`);
    },
  },
  methods: {
    deleteRecord (surveyId) {
      this.$store.dispatch('observation/deleteSurvey', surveyId);
      this.triggerReveal = !this.triggerReveal;
    },
    expertReview (surveyId) {
      this.$store.dispatch('observation/expertReviewSurvey', surveyId);
      this.triggerReveal = !this.triggerReveal;
    },
  },
};
</script>

<style lang="scss" scoped>
  .content {
    display: flex;
    img {
      max-width: 3rem;
    }
    dd {
      font-size: 1rem;
      font-weight: 500;
    }
    dt {
      font-size: .8rem;
      color: #5d636a;
    }
  }
</style>
