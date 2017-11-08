<template>
  <div class="input-field">
    <label>
      <i class="material-icons">comment</i>
    </label>
    <textarea class="textarea" 
              name="notes"
              placeholder="Notes..."></textarea>
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
  .input-field {
    margin: 1rem 1rem .5rem 1rem;
    display: flex;
    align-items: center;
    label {
      margin-right: .5rem;
      display: flex;
    }
  }
  .textarea {
    box-sizing: border-box;
    width: 100%;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    border: 1px #D2D6DF solid;
    border-radius: 3px;
    color: #45494E;
    background-color: #fff;
    font-size: 16px;
    line-height: 16px;
    height: 5rem;
  }
</style>
