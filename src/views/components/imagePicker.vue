<template>
  <div class="imagePicker">
   <ul>
     <li v-for="thumbnail in thumbnails">
       <img :src="thumbnail">
     </li>
     <li>
      <input type="file" name="imagePicker" id="imagePicker" class="inputFile"
        multiple
        @change="onFileChange">
      <label for="imagePicker">
        <i class="material-icons">add_a_photo</i>
      </label>
     </li>
   </ul>
  </div>
</template>

<script>
// import Exif from 'exif-js';
import { createNamespacedHelpers } from 'vuex';

const {
  mapGetters: mapGettersObserve,
  mapActions: mapActionsObserve,
} = createNamespacedHelpers('observe');

export default {
  name: 'imagePicker',
  data () {
    return {
      files: [],
    };
  },
  props: {
    observationId: {
      type: [Number, String],
      default () { return undefined; },
    },
  },
  computed: {
    ...mapGettersObserve([
      'getObservationById',
    ]),
    obsId () {
      return Number(this.observationId);
    },
    activeDraft () {
      return this.getObservationById(this.obsId);
    },
    thumbnails () {
      const draftObservation = this.activeDraft;
      if (draftObservation) {
        return draftObservation.images.map(image => URL.createObjectURL(image));
      }
      return [];
    },
  },
  methods: {
    ...mapActionsObserve([
      'hydrateImageMetadata',
      'addImage',
    ]),
    onFileChange (e) {
      const files = e.target.files;
      if (!files.length) {
        return;
      }
      [...files].forEach((image) => {
        this.addImage({ image, obsId: this.obsId });
        this.hydrateImageMetadata({ image, obsId: this.obsId });
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
}

li {
  display: flex;
  max-width: 20vw;
  flex-direction: column;
  justify-content: center;
  margin: .2rem;
}

a {
  color: #42b983;
}

img {
  width: 100%;
}

.imagePicker {
  display: flex;
  align-items: flex-start;
}


.inputFile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.inputFile + label {
  font-size: 1.25em;
  font-weight: 700;
  display: inline-block;
  min-width: 40px;
  min-height: 40px;
  /*border: 2px solid;*/
  display: flex;
  justify-content: center;
  align-items: center;
}

.material-icons {
  margin-left: 0.6rem;
}
</style>
