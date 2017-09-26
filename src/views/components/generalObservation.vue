<template>
  <div class="general-observation">
    <div class="container">
      <div class="form-block">
        <p>Add images :</p>
        <imagePicker :observationId="obsId"></imagePicker>
      </div>
      <div @click="$router.push({ name: 'SpeciePicker', params : { observationId: obsId } })"class="form-block">
        <template v-if="taxonId">
        <dl>
          <dt>Common name :</dt>
          <dd>{{commonName}}</dd>
          <dt>Scientific :</dt>
          <dd>{{scientificName}}</dd>
        </dl>
        </template>
        <template v-else>
          <div class="specie-lookup">
            <div>
              <i class="material-icons">search</i>
              <p class="specie-lookup-text">Lookup Species</p>
            </div>
            <div>
              <i class="material-icons">chevron_right</i>
            </div>
          </div>
        </template>
      </div>
      <div @click="$router.push({ name: 'LocationPicker', params : { observationId: obsId } })"class="form-block">
        <template v-if="coordinates">
          <p>Lat: {{latitude}}</p>
          <p>Long: {{longitude}}</p>
          <p>{{locationDescription}}</p>
        </template>
        <div v-else class="location-picker">
          <div class="">
            <i class="material-icons">pin_drop</i>
            <p class="location-picker-initial-text">Enter location :</p>
          </div>
            <i class="material-icons">chevron_right</i>
        </div>
      </div>
      <div class="form-block">
        <datePicker :obsId="obsId"></datePicker>
      </div>
      <div class="form-block">
        <extraInfo :obsId="obsId"></extraInfo>  
      </div>
      <div class="form-block">
        <div class="input-field">
          <label>
            Notes :
          </label>
          <textarea class="textarea" name="notes"
            placeholder="..."></textarea>
        </div>
      </div>
      <div class="form-block">
        <countPicker :obsId="obsId"></countPicker>
      </div>
      <div class="action">
      <template v-if="!recordedId">
        <button v-if="!uploading"class="button" 
          @click="upload"
          :class="{ deactivated: !obsIsValid }"
          :disabled="!obsIsValid">Upload
        </button>
        <div v-else class="loader loader--style3" title="2">
          <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
          <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
            <animateTransform attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.6s"
              repeatCount="indefinite"/>
            </path>
          </svg>
        </div>
      </template>
      <template v-if="recordedId">
        <h2>Upload succes !</h2>
      </template>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex';
import { createNamespacedHelpers } from 'vuex';
import imagePicker from './imagePicker';
import speciePicker from './speciePicker';
import datePicker from './datePicker';
import countPicker from './countPicker';
import extraInfo from './extraInfo';

const {
  mapGetters: mapGettersObserve,
  mapActions: mapActionsObserve,
} = createNamespacedHelpers('observe');

export default {
  name: 'generalObservation',
  components: {
    imagePicker,
    speciePicker,
    datePicker,
    countPicker,
    extraInfo,
  },
  props: {
    observationId: {
      type: [Number, String],
      default () { return undefined; },
    },
  },
  data () {
    return {
      uploading: false,
    };
  },
  computed: {
    ...mapGettersObserve([
      'allitems',
      'getObservationById',
    ]),
    obsId () {
      return Number(this.observationId);
    },
    activeDraft () {
      return this.getObservationById(this.obsId);
    },
    taxonomy () {
      const draftObservation = this.activeDraft;
      return draftObservation
        ? draftObservation.taxonomy
        : null;
    },
    taxonId () {
      return this.taxonomy
        ? this.taxonomy.taxonId
        : null;
    },
    commonName () {
      const draft = this.activeDraft;
      return draft
        ? draft.taxonomy.commonName
        : null;
    },
    scientificName () {
      const draft = this.activeDraft;
      return draft
        ? draft.taxonomy.scientificName
        : null;
    },
    coordinates () {
      const draft = this.activeDraft;
      if (!draft || !draft.position) return null;
      return (draft.position.latitude && draft.position.longitude)
        ? draft.position
        : null;
    },
    latitude () {
      return this.coordinates
        ? this.coordinates.latitude
        : null;
    },
    longitude () {
      return this.coordinates
        ? this.coordinates.longitude
        : null;
    },
    locationDescription () {
      return this.activeDraft.position.description;
    },
    obsIsValid () {
      const draft = this.activeDraft;
      if (!draft) return true;
      if (draft.taxonomy.taxonId !== null
        && draft.position.latitude !== null
        && draft.position.longitude !== null
        && draft.datetime !== null) {
        return true;
      }
      return false;
    },
    recordedId () {
      const draft = this.activeDraft;
      if (!draft) return false;
      return draft.recordedId;
    },
  },
  methods: {
    ...mapActionsObserve([
      'createObservation',
      'uploadObservation',
    ]),
    navigateTo (routeName) {
      this.$router.push({ name: routeName, params: { obsId: this.obsId } });
    },
    upload () {
      console.log('uploading start');
      this.uploading = true;
      this.uploadObservation({ observation: this.activeDraft })
        .then(() => this.false);
    },
  },
  mounted: async function mountedEvent () {
    if (this.observationId === undefined) {
      const observationId = await this.createObservation();
      console.log(`new draft created ${observationId}`);
      this.$router.replace({ name: 'GeneralObs', params: { observationId } });
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  margin: 1rem .5rem 1rem .5rem;
  /*margin-bottom: 3rem;*/
}

.specie-lookup {
  margin: 1rem 1rem .5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
}

.specie-lookup div:first-child {
  display: flex;
  align-items: center;
}

.specie-lookup-text {
  margin-left: .5rem;
}

.location-picker {
  margin: 1rem 1rem .5rem 1rem;
  display: flex;
  justify-content: space-between;
}

.location-picker div:first-child {
  display: flex;
  align-items: center;
}

.location-picker-initial-text {
  margin-left: .5rem;
  display: flex;
}
.form-block {
  border-bottom: 0.05rem solid rgba(32, 22, 71, 0.3);
  margin: .5rem 0 .5rem;
  padding-bottom: .5rem;
}

.action {
  display: flex;
  width: 100%;
  justify-content: center;
}

.button {
  box-shadow: 
    0 2px 2px 0 rgba(0,0,0,0.14),
    0 1px 5px 0 rgba(0,0,0,0.12),
    0 3px 1px -2px rgba(0,0,0,0.2);
}

.deactivated {
  box-shadow: none;
  background-color: #c9c9c9;
}

.textarea {
  box-sizing: border-box;
  width: 100%;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  border: 1px #D2D6DF solid;
  border-radius: 3px;
  color: #45494E;
  background-color: #fff;
  font-size: 16px;
  line-height: 16px;
  height: 5rem;
}

.navigation {
  display: flex;
  justify-content: space-around;
}

</style>
