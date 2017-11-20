<template>
  <div class="imagePicker">
    <div class="icons">
      <input type="file"
             name="imagePicker" 
             id="imagePicker" 
             class="inputFile"
             multiple
             @change="onFileChange">
      <label for="imagePicker">
        <i class="material-icons">add_a_photo</i>
      </label>
    </div>
    <ul>
      <li class="thumbnail" v-for="thumbnail in thumbnails">
        <img :src="thumbnail.objectUrl"
          @click="$router.push({ name: 'imageSlideshow', params : { observationId: obsId, imageId: thumbnail.imageId } })">
      </li>
      <li class="addIcons" v-if="thumbnails.length > 0">
        <label for="imagePicker">
          <i class="material-icons">add</i>
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
        return draftObservation.images.map((image) => {
          const objectUrl = URL.createObjectURL(image.data);
          const imageId = image.metadata.id;
          console.log({ objectUrl, imageId });
          return { objectUrl, imageId };
        });
      }
      return [];
    },
  },
  methods: {
    ...mapActionsObserve([
      'processExifData',
      'getImageMetadata',
      'addImage',
    ]),
    onFileChange (e) {
      const files = e.target.files;
      console.log(e, files);
      if (!files.length) {
        return;
      }
      [...files].forEach(async (image) => {
        try {
          const metadata = await this.getImageMetadata({ image, obsId: this.obsId });
          console.log(metadata);
          this.addImage({ image, metadata, obsId: this.obsId });
          this.processExifData({ imageMetadata: metadata, obsId: this.obsId });
        } catch (error) {
          console.log(error);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
  border-radius: 3px;
}

.imagePicker {
  display: flex;
  align-items: center;

  li {
    min-width: 25%;
    flex: 1;
  }
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

.icons{
  margin-right: 1rem;
}

.thumbnail {
}

.addIcons {
  label {
    margin: auto;
  }
  i {
    margin: 0;
  }
}
</style>
