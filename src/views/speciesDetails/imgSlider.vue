<template>
  <div>
    <div class="images">
      <img :src="currentImage.s3Url">
    </div>
    <div class="credit" v-if="currentImage.source">
      <p>Source: {{currentImage.source}}</p>
    </div>
    <div v-if="images.length > 1" class="controls">
      <button @click="previous"
        :class="{hidden: (!this.selectedImg > 0)}"
        class="nav-button">
        <i class="material-icons">chevron_left</i>
      </button>
      <p>{{selectedImg + 1}}/{{images.length}}</p>
      <button @click="next"
        :class="{hidden: (this.selectedImg >= this.media.length - 1)}"
        class="nav-button">
        <i class="material-icons">chevron_right</i>
      </button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'imageSlide',
  data () {
    const data = { // eslint-disable-line no-unused-vars
      selectedImg: 0,
    };
    return data;
  },
  props: {
    images: {
      type: Array,
    },
  },
  computed: {
    media () {
      const media = this.images;
      if (media) return media;
      return null;
    },
    currentImage () {
      console.log(this.selectedImg, this.media[this.selectedImg]);
      return this.media[this.selectedImg];
    },
    credit () {
      if (!this.media) return {};
      const media = this.media[this.selectedImg];
      return {
        by: media.author,
      };
      // || media.creators[0].replace('Photographer: ', ''),
    },
  },
  methods: {
    next () {
      if (this.selectedImg < this.media.length - 1) this.selectedImg += 1;
    },
    previous () {
      console.log(this.media.length);
      if (this.selectedImg > 0) this.selectedImg -= 1;
    },
  },
};
</script>

<style scoped>
.images {
  display: flex;
  justify-content: center;
  height: 36vh;
}

.images img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  overflow: auto;
}
.controls {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}
.nav-button {
  display: flex;
  max-width: 10vw;
  justify-content: center;
  background-color: rgba(128,128,128,.4);
  color: #646464;
  border: none;
  background-color: #eee;
}

.credit {
  margin-left: 1rem;
}
</style>
