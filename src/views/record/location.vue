<template>
  <div>
    <img :src="staticMapSource">
  </div>
</template>

<script>
export default {
  name: 'record-location',
  props: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  computed: {
    staticMapSource () {
      const longitude = this.longitude;
      const latitude = this.latitude;
      const mapboxStyle = 'panelvw/cj4f5jcy500pw2rsetkub2wos';
      const mapboxToken = 'pk.eyJ1IjoicGFuZWx2dyIsImEiOiJjaW56cmlxaTcxOTk1dTJtM3F2aGE3Y25mIn0.bKj9LERNGK-5royXLrqthg';
      return `https://api.mapbox.com/styles/v1/${mapboxStyle}/static/pin-s(${longitude},${latitude})/${longitude},${latitude},15/1000x1000?access_token=${mapboxToken}`;
    },
  },
};
</script>

<style lang="">
</style>
