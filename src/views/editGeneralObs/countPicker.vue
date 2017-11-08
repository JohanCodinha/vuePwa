<template>
  <div class="countPicker">
    <label for="count">
      <i class="material-icons">grain</i>
      Count
    </label>
    <div class="count-picker">
      <i @click="remove" class="material-icons">exposure_minus_1</i>
      <input class="number-input"
        v-model="count" id="count" type="number" pattern="\d*">
      <i @click="add" class="material-icons">exposure_plus_1</i>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const {
  mapGetters: mapGettersObserve,
  mapActions: mapActionsObserve,
} = createNamespacedHelpers('observe');


export default {
  name: 'countPicker',
  // data () {
  //   return {
  //   };
  // },
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
    count: {
      get: function getter () {
        if (!this.activeDraft) return null;
        return this.activeDraft.count
          ? this.activeDraft.count
          : 1;
      },
      set: function setter (value) {
        const count = Number(value);
        const obsId = this.obsId;
        if (!isNaN(count) && count >= 1) {
          console.log(`count set to ${value}`);
          this.setCount({ count, obsId });
        } else {
          console.log(`value : ${count} of type ${typeof count} is not valid`);
        }
      },
    },
  },
  methods: {
    ...mapActionsObserve([
      'setCount',
    ]),
    add () {
      console.log(this.count);
      this.count = this.count + 1;
    },
    remove () {
      this.count = this.count - 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.countPicker {
  display: flex;
  margin: 1rem 1rem .5rem 1rem;
  label {
    display: flex;
    flex-direction: column;
  }
}
h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    display: flex;
    flex-direction: column;
  }

  li {
    display: inline-block;
    margin: .1rem;
    border: 1px solid black
  }

  li:hover {
    display: inline-block;
    margin: .1rem;
    border: 1px solid pink
  }

  a {
    color: #42b983;
  }
  .count-picker {
    display: flex;
    flex: 1;
    justify-content: space-around;
    align-items: center;
  }

  .number-input {
    text-align: center;
    display: block;
    width: 4rem;
    height: 100%;
    padding: 8px 12px 9px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 2px;
    outline: none;
    border: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    -webkit-appearance: none;
    -moz-appearance:textfield;
  }
</style>
