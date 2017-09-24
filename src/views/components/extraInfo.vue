<template>
  <div class="input-field">
    <label for="extra-info">Extra information:</label>
    <select class="form-select" name="extra-info" id="extra-info" v-model="selected">
      <option v-for="option in options"
        :value="option.value">{{ option.text }}</option>
    </select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'extraInfo',
  data () {
    return {
      options: [
        { text: '', value: null },
        // { text: 'Beach washed', value: 'w' },
        { text: 'Breeding', value: 'b' },
        // { text: 'Carnivore bait', value: 'carni' },
        // { text: 'Cultivated', value: 'cult' },
        // { text: 'Escapee', value: 'e' },
        // { text: 'Evidence of past use', value: 'past' },
        { text: 'Found dead', value: 'k' },
        // { text: 'Herbivore bait', value: 'herbi' },
        // { text: 'In predator scat', value: 'z' },
        // { text: 'No longer present at site', value: 'x' },
        // { text: 'EscaReleased / Introduced', value: 'r' },
        // { text: 'Roost site', value: 'c' },
        // { text: 'Sub fossil', value: 's' },
        // { text: 'Voucher specimen', value: 'v' },
      ],
    };
  },
  props: {
    obsId: {
      type: Number,
      default () { return undefined; },
    },
  },
  computed: {
    ...mapGetters([
      'allitems',
    ]),
    activeDraft () {
      const draft = this.allitems.find(item => item.id === this.obsId);
      return draft;
    },
    selected: {
      get: function getter () {
        if (!this.activeDraft) return null;
        return this.activeDraft.extraInfoCode;
      },
      set: function setter (code) {
        this.$store.dispatch('setExtraInfo', { code, obsId: this.obsId });
      },
    },
  },
};
</script>

<style scoped>
.form-select {
/*  opacity: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: pointer;
  z-index: 1;
  display: block;
  font-size: 16px;
  background: #fff;
  overflow: hidden;
  -webkit-appearance: menulist-button;*/
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
  height: 2rem;
}
</style>
