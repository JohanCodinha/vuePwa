<template>
  <card class="content">
    <dl slot="content"
      @click="$router.push({ name: 'survey', params: { surveyId } })">
      <dt v-if="commonName || scientificName" >Specie</dt>
      <dd>{{commonName || scientificName}}</dd>
      <dt>Site name</dt>
      <dd>{{siteName}}</dd>
<!--       <dt>Survey ID</dt>
      <dd>{{surveyId}}</dd> -->
      <dt>Date</dt>
      <dd>{{formatedDate}}</dd>
      <dt>Status</dt>
      <dd>{{status === 'a' ? 'Approved' : status}}</dd>
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

<style scoped>
.content dl dd {
  font-size: 1.2rem;
  font-weight: 600;
}

.content dl dt {
  color: #5d636a;
}
</style>
