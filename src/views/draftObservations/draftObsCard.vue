<template>
  <card>
    <img v-if="imageUrl" slot="image" :src="imageUrl">
    <div class="content" slot="content">
      <dl @click="$router.push({ name: 'GeneralObs', params: { observationId: obsId } })">
          <dt>Species</dt>
          <dd>{{specieName || 'Unidentified'}}</dd>
          <dt>Site name</dt>
          <dd>{{siteName || 'Unknown location'}}</dd>
          <dt>Status</dt>
          <dd>{{status}}</dd>
      </dl>
      <div v-if="false" class="action">
        <button class="button"
          :class="{ deactivated: !isUploadable }" @click=''>
          upload</button>
      </div>
    </div>
    <div slot="reveal">
      <a class="btn red_" @click='deleteDraft'>Delete </a>
    </div>
  </card>
</template>

<script>
import card from '@/views/components/card';

import { mapGetters } from 'vuex';

export default {
  name: 'draft-observation-card',
  components: {
    card,
  },
  data () {
    return {
      cardRevealed: false,
    };
  },
  props: {
    siteName: {
      type: String,
      default () { return 'Location not specified'; },
    },
    status: {
      type: String,
      default () { return undefined; },
    },
    specieName: {
      type: String,
      default () { return 'Specie not selected'; },
    },
    obsId: {
      type: Number,
      default () { return undefined; },
    },
    image: {},
  },
  computed: {
    ...mapGetters([
      'isLogin',
    ]),
    imageUrl () {
      if (this.image) return URL.createObjectURL(this.image);
      return null;
    },
    isValid () {
      return true;
    },
    isUploadable () {
      return this.isValid && this.isLogin;
    },
  },
  methods: {
    // ...mapActions([
    // ]),
    deleteDraft () {
      this.$store.dispatch('observe/deleteObservation', this.obsId);
    },
    upload () {
      console.log('uploading start');
      this.$store.dispatch('uploadObservation', { observation: this.obsId });
    },
  },
};
</script>

<style scoped>
.button {
  color: #26a69a;
  background-color: transparent;
}

.action {
  display: flex;
  justify-content: flex-end;
}

.deactivated {
  color: grey;
}

.content {
  width: 100%;
}

.content dl dd {
  font-size: 1.2rem;
  font-weight: 600;
}

.content dl dt {
  color: #5d636a;
}
</style>
