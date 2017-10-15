<template>
  <div>
    <div class="images">
      <button @click="previous"
        :class="{hidden: (!this.selectedImg > 0)}"
        class="nav-button">
        <p>prev</p>
      </button>
      <img :src="currentImage">
      <button @click="next"
        :class="{hidden: (this.selectedImg >= this.media.length - 1)}"
        class="nav-button">
        <p>next</p>
      </button>
    </div>
    <div class="credit" v-if="credit.by">
      <p>Author: {{credit.by}}</p>
      <!-- <p>Licence: {{credit.licence}}</p> -->
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
      const media = this.media[this.selectedImg];
      return media.s3Url;
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
  align-items: center;
  justify-content: space-between;
  height: 30vh;
}

.images img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  overflow: auto;
}

.nav-button {
  display: flex;
  max-width: 10vw;
  justify-content: center;
  background-color: rgba(128,128,128,.4);
}

.hidden {
  visibility: hidden;
}
.credit {
  margin-left: 1rem;
}
</style>
