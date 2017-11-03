<template>
  <div class="location-picker">
    <i class="material-icons">pin_drop</i>
    <div v-if="latitude && longitude"
         class="location"
         @click="$router.push({ name: 'LocationPicker', params : { observationId }})">
      <p>{{locationDescription}}</p>
      <div>
        <dl>
          <dt>Lat </dt>
          <dd>{{latitude}}</dd>
          <dt>Long</dt>
          <dd>{{longitude}}</dd>
        </dl>
      </div>
    </div>
    <div v-else
         class="buttons">
      <button class="button"
              @click="getLocation">
        Use GPS
      </button>
      <button class="button"
              @click="$router.push({ name: 'LocationPicker', params : { observationId }})">
        Edit location
      </button>
    </div>
    <div>
      <i class="material-icons">chevron_right</i>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const {
  mapActions: mapActionsLocation,
  // mapGetters: mapGettersLocation,
} = createNamespacedHelpers('location');

export default {
  name: 'locationField',
  props: {
    observationId: {
      type: Number,
    },
    latitude: {
      type: String,
      default () { return ''; },
    },
    longitude: {
      type: String,
      default () { return ''; },
    },
    locationDescription: {
      type: String,
      default () { return ''; },
    },
  },
  methods: {
    ...mapActionsLocation([
      'getPosition',
    ]),
    async getLocation () {
      try {
        await this.getPosition();
        const { latitude, longitude, accuracy } = this.position;
        this.$store.dispatch('observe/saveLocation', { latitude, longitude, accuracy, obsId: this.observationId });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.location-picker {
    margin: 1rem 1rem .5rem 1rem;
    display: flex;
    align-items: center;
  }

  .location-picker div:first-child {
    display: flex;
    align-items: center;
  }

  .location-picker-initial-text {
    margin-left: .5rem;
    display: flex;
  }
  .location {
    margin-left: .5rem;
  }
  .location-picker {
    .buttons {
      display: flex;
      margin-left: .5rem;
      justify-content: space-around;
      flex: 1;
    }
    button {
      display: block;
      width: 100%;
      margin-left: .25rem;
      margin-right: .25rem;
      padding: 0;
    }
  }
</style>
