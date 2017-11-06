<template>
  <card @click.native="$router.push({ name: 'survey', params: { surveyId } })">
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
          <dd>{{status === 'a' ? 'Approved' : status}}</dd>
        </div>
      </div>
    </dl>
    <div slot="reveal">
      <a class="btn red_"
         @click='deleteRecord(surveyId)'>Delete
         <!-- <i class="material-icons right">delete</i> -->
      </a>
      <a class="btn_"
         @click=''>Edit</a>
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
    // ...mapGetters({
    //   generalObs: 'general',
    // }),
    formatedDate () {
      const date = new Date(this.startDate);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    },
    imageSources () {
      if (this.imagesId.length < 1) return null;
      return this.imagesId.map(id => `https://res.cloudinary.com/vba/image/fetch/w_300,f_auto/https://vba.dse.vic.gov.au/vba/getFile.do%3Fid%3D${id}`);
    },
  },
  methods: {
    // ...mapActions([
    // ]),
    deleteRecord (surveyId) {
      this.$store.dispatch('observation/deleteSurvey', surveyId);
    },
  },
};
</script>

<style lang="scss" scoped>
  .content {
    display: flex;
    height: 100%;
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
