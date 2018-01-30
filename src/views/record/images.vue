<template>
  <div class="image-container">
    <img :src="imageSource">
  </div>
</template>

<script>
export default {
  name: 'record-images',
  props: {
    imageId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    imageSource () {
      return `https://res.cloudinary.com/vba/image/fetch/w_600,f_auto/https://vba.dse.vic.gov.au/vba/getFile.do%3Fid%3D${this.imageId}`;
    },
  },
};
</script>

<style lang="scss">
.image-container {
  display: flex;
  justify-content: center;

  img {
    max-width: 100%;
  }
}
</style>
