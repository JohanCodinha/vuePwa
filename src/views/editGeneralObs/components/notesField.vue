<template>
  <div class="input-field">
    <label>
      <i class="material-icons">comment</i>
    </label>
    <textarea class="textarea" 
              v-model="notes"
              name="notes"
              placeholder="Notes...">
    </textarea>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { get } from 'lodash';

const {
  mapActions: mapActionsObserve,
  mapGetters: mapGettersObserve,
} = createNamespacedHelpers('observe');

export default {
  name: 'notes-field',
  props: {
    obsId: {
      type: [String, Number],
    },
  },
  computed: {
    ...mapGettersObserve([
      'getObservationById',
    ]),
    observation () {
      return this.getObservationById(this.obsId);
    },
    notes: {
      get: function getter () {
        return get(this.observation, 'notes', '');
      },
      set: function setter (notes) {
        this.setNotes({ notes, obsId: this.obsId });
      },
    },
  },
  methods: {
    ...mapActionsObserve([
      'setNotes',
    ]),
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
