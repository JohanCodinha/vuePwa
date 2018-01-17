<template>
  <div class="general-observation">
    <div class="container">
      <div class="form-block">
        <h1>I observed...</h1>
        <imagePicker :observationId="obsId"></imagePicker>
      </div>
      <div @click="$router.push({ name: 'SpeciePicker', params : { observationId: obsId } })"class="form-block">
          <div class="specie-lookup">
            <div>
              <i class="material-icons">search</i>
              <dl v-if="taxonId">
                <dd class="commonName" >{{commonName}}</dd>
                <dd>{{scientificName}}</dd>
              </dl>
              <p class="specie-lookup-text" v-else>Lookup Species</p>
            </div>
            <div>
              <i class="material-icons">chevron_right</i>
            </div>
          </div>
      </div>
      <div class="form-block">
        <location-field 
          :observationId="observationId" 
          :locationDescription="locationDescription"
          :longitude="longitude"
          :latitude="latitude"></location-field>
      </div>
      <div class="form-block">
        <datePicker :obsId="obsId"></datePicker>
      </div>
      <div class="form-block">
        <extraInfo :obsId="obsId"></extraInfo>  
      </div>
      <div class="form-block">
        <notes-field :obsId="obsId" ></notes-field>
      </div>
      <div class="form-block">
        <countPicker :obsId="obsId"></countPicker>
      </div>
      <div class="action">
      <template v-if="!recordedId">
        <button class="button" 
          @click="upload"
          :class="{ deactivated: !obsIsValid || uploading }"
          :disabled="!obsIsValid || uploading">Upload
        </button>
      </template>
      <h2 v-else>Upload success !</h2>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex';
import { createNamespacedHelpers } from 'vuex';
import { get } from 'lodash';
import imagePicker from './imagePicker';
import speciePicker from './speciePicker';
import datePicker from './datePicker';
import countPicker from './countPicker';
import extraInfo from './extraInfo';
import locationField from './components/locationField';
import notesField from './components/notesField';

const {
  mapGetters: mapGettersObserve,
  mapActions: mapActionsObserve,
} = createNamespacedHelpers('observe');

const {
  mapActions: mapActionsLocation,
  mapGetters: mapGettersLocation,
} = createNamespacedHelpers('location');

export default {
  name: 'generalObservation',
  components: {
    imagePicker,
    speciePicker,
    datePicker,
    countPicker,
    'location-field': locationField,
    extraInfo,
    'notes-field': notesField,
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
    ...mapGettersLocation([
      'position',
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
      return get(this.activeDraft, 'position.description', '');
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
    ...mapActionsLocation([
      'getPosition',
    ]),
    navigateTo (routeName) {
      this.$router.push({ name: routeName, params: { obsId: this.obsId } });
    },
    async upload () {
      try {
        console.log('uploading start');
        this.uploading = true;
        await this.uploadObservation({ observation: this.activeDraft });
        this.uploading = false;
      } catch (error) {
        this.$store.dispatch('errors/addSnackbar', { message: error.message, timeout: 3500 }, { root: true });
      }
    },
    async getLocation () {
      try {
        await this.getPosition();
        const { latitude, longitude, accuracy } = this.position;
        this.$store.dispatch('observe/saveLocation', { latitude, longitude, accuracy, obsId: this.obsId });
        // dispatch('location/getPosition', null, { root: true });
      } catch (error) {
        console.log(error);
      }
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
<style lang="scss" scoped>
  .container {
    margin: 1rem .5rem 1rem .5rem;
    /*margin-bottom: 3rem;*/
  }

  .specie-lookup {
    margin: 1rem 1rem .5rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    dl {
      margin-left: .5rem;
    }
    .commonName {
      font-size: 1.2rem;
      font-weight: 500;
    }
  }

  .specie-lookup div:first-child {
    display: flex;
    align-items: center;
  }

  .specie-lookup-text {
    margin-left: .5rem;
  }

  
  .form-block {
    //border-bottom: 0.05rem solid rgba(32, 22, 71, 0.3);
    margin: .5rem 0 .5rem;
    padding-bottom: .5rem;
    h1 {
      margin: .5rem;
      font-size: 1.5rem;
    }
  }

  .action {
    display: flex;
    justify-content: center;
    margin: 2rem;
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

  .material-icons {
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
