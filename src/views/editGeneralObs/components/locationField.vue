<template>
  <div class="location-picker">
    <div class="container">
      <i class="material-icons">pin_drop</i>
      <div v-if="latitude && longitude"
           class="location"
           @click="$router.push({ name: 'LocationPicker', params : { observationId }})">
        <p class="description">{{description}}</p>
        <div class="coordinates">
          <p>{{coordinates}}</p>
        </div>
      </div>
      <div v-else
             class="buttons">
        <button v-if="false" class="button"
                @click="getLocation">
          Use GPS
        </button>
        <button class="button"
                @click="$router.push({ name: 'LocationPicker', params : { observationId }})">
          Edit location
        </button>
      </div>
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
  mapGetters: mapGettersLocation,
} = createNamespacedHelpers('location');

export default {
  name: 'locationField',
  props: {
    observationId: {
      type: [String, Number],
    },
    latitude: {
      type: Number,
      default () { return ''; },
    },
    longitude: {
      type: Number,
      default () { return ''; },
    },
    locationDescription: {
      type: String,
      default () { return ''; },
    },
  },
  computed: {
    ...mapGettersLocation([
      'position',
    ]),
    description () {
      const csv = this.locationDescription.split(',');
      if (!csv[1]) return '';
      return `${csv[0]}, ${csv[1]}`;
    },
    coordinates () {
      return `${this.latitude.toString().slice(0, 8)}, ${this.longitude.toString().slice(0, 8)}`;
    },
  },
  methods: {
    ...mapActionsLocation([
      'getPosition',
    ]),
    async getLocation () {
      try {
        const position = await this.getPosition();
        console.log(position, this.observationId);
        const { latitude, longitude, accuracy } = position;
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
    justify-content: space-between;
    .description {
      font-weight: 500; 
    }

    .container {
      flex: 1;
    }
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

  .coordinates {
    div {
      
    }
  }
</style>
