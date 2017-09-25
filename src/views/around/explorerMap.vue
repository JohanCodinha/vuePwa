<template>
  <div class="static-map">
    <div id="map" class="mapboxgl-map"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import token from '@/api/token.json';
import { createNamespacedHelpers } from 'vuex';
// import { debounce, get } from 'lodash'; // eslint-disable-line
const {
  mapActions,
  mapGetters: mapGettersExplore,
} = createNamespacedHelpers('explore');
const { mapGetters: mapGettersLocation } = createNamespacedHelpers('location');
const mapboxToken = token.mapbox;

export default {
  name: 'explorer-map',
  data () {
    return {
    };
  },
  props: {

  },
  computed: {
    ...mapGettersLocation([
      'position',
    ]),
    ...mapGettersExplore([
    // 'position',
      'records',
    ]),
  },
  methods: {
    ...mapActions([
    ]),
    createMap () {
      console.log('createMap');
      const { latitude, longitude } = this.position;
      if (!longitude || !longitude) return;
      mapboxgl.accessToken = mapboxToken;
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/panelvw/cj4f5jcy500pw2rsetkub2wos',
        center: [longitude, latitude],
        zoom: 12,
        // maxBounds: bounds,
        interactive: false,
      });
      this.$data.map = map;
      map.on('load', () => {
        console.log('adding sources');
        map.addSource('records', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });
        map.addLayer({
          id: 'point',
          source: 'records',
          type: 'circle',
          paint: {
            'circle-radius': 10,
            'circle-color': '#007cbf',
          },
        });
        this.addRecordData();
      });
    },
    addRecordData () {
      console.log('adding record');
      const records = this.records;
      const features = records.map((record) => {
        const feature = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [
              record.longitudeddNum,
              record.latitudeddNum],
          },
        };
        return feature;
      });
      const formatedFeatures = Object.assign({}, { type: 'FeatureCollection' }, {
        features,
      });
      const recordsSource = this.$data.map.getSource('records');
      recordsSource.setData(formatedFeatures);
    },
  },
  watch: {
    // eslint-disable-next-line
    position: function () { this.createMap() },
    // eslint-disable-next-line
    records: function (records) {
      if (!this.$data.map.getSource('records')) return;
      this.addRecordData();
    },
  },
  // eslint-disable-next-line
  mounted: function() {
    console.log(this.position, this.map);
    if (this.position && !this.map) this.createMap();
  },
};
</script>

<style scoped>
.static-map {
  height: 20rem;
}

#map {
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

</style>
