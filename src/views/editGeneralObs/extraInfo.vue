<template>
  <div class="input-field">
    <i class="material-icons">info_outline</i>
    <ul class="radioList">
      <li v-for="option in options">
        <input type="radio"
               :id="option.text"
               :value="option.value"
               name="extraInfo"
               @click="radioClick(option.value)"> 
        <label :for="option.text">
          <i class="material-icons">radio_button_{{option.value === selected ? 'checked':'unchecked'}}</i>
          <p>{{option.text}}</p>
        </label>
      </li>
    </ul>
    <!-- <select class="form-select" name="extra-info" id="extra-info" v-model="selected">
      <option v-for="option in options"
        :value="option.value">{{ option.text }}</option>
    </select>
    --> 
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const {
  mapGetters: mapGettersObserve,
  mapActions: mapActionsObserve,
} = createNamespacedHelpers('observe');

export default {
  name: 'extraInfo',
  data () {
    return {
      options: [
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
    ...mapGettersObserve([
      'getObservationById',
    ]),
    activeDraft () {
      return this.getObservationById(this.obsId);
    },
    selected () {
      if (!this.activeDraft) return null;
      return this.activeDraft.extraInfoCode;
    },
  },
  methods: {
    ...mapActionsObserve([
      'setExtraInfo',
    ]),
    radioClick (code) {
      console.log(code, this.selected);
      if (this.selected === code) {
        return this.setExtraInfo({ code: null, obsId: this.obsId });
      }
      return this.setExtraInfo({ code, obsId: this.obsId });
    },
  },
};
</script>

<style lang="scss" scoped>
.form-select {
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

.input-field {
  display: flex;
  align-items: center;
  margin: 1rem 1rem .5rem 1rem;
  i {
    margin-right: .5rem;
  }
}

.radioList {
  display: flex;
  li {
    display: flex;
    max-height: 2rem;
    background-color: #dfdfdf;
    border-radius: 1rem;
    margin: .5rem;
    padding-right: .5rem;
  }
  label {
    color: #2c3f50;
    display: flex;
    align-items: center;
  }
  input {
    margin: 0;
    display: none;
  }
  i {
    margin: .3rem;
  }

}
</style>
