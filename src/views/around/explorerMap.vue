<template>
  <div class="static-map">
    <div id="map" class="mapboxgl-map">
      <div class="map-gradient"></div>
    </div>
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
        zoom: 14,
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
            'circle-radius': 6,
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
  min-height: 20rem;
}
.map-gradient {
  background: linear-gradient(to bottom,rgba(255,255,255,0),#f5f5f5);
  border-bottom: 12px solid #f5f5f5;
  bottom: 0;
  height: 90px;
  position: absolute;
  width: 100%;
  z-index: 1;
}

#map {
  top: 0;
  bottom: 0;
  width: 100%;
  min-height: 20rem;
}

</style>
