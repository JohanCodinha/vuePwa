<template>
  <div class="date-picker">
    <label>
      <i class="material-icons">today</i>
    </label>
    <input v-model="obsDatetime" id="datetime" type="datetime-local">
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { format } from 'date-fns';

export default {
  name: 'datePicker',
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
    ...mapGetters([
      'allitems',
    ]),
    activeDraft () {
      const draft = this.allitems.find(item => item.id === this.obsId);
      return draft;
    },
    obsDatetime: {
      get: function dateGetter () {
        if (!this.activeDraft) return null;
        if (!this.activeDraft.datetime) {
          const datetimeString = format(new Date(), 'YYYY-MM-DDTHH:mm');
          this.$store.dispatch('setDatetime', { datetimeString, obsId: this.obsId });
          return this.activeDraft.datetime;
        }
        return this.activeDraft.datetime;
      },
      set: function dateSetter (datetimeString) {
        this.$store.dispatch('setDatetime', { datetimeString, obsId: this.obsId });
      },
    },
  },
  methods: {
  },
};
</script>

<style scoped>
.date-picker {
  display: flex;
  /*flex-direction: column;*/
  align-items: center;
  flex: 1;
  width: 100%;
}

.material-icons {
  margin-left: 1rem;
}

.date-picker input {
  flex: 1;
  margin-left: .5rem;
  box-sizing: border-box;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  border: 1px #D2D6DF solid;
  border-radius: 3px;
  color: #45494E;
  background-color: #fff;
  font-size: 1rem;
  height: 2rem;
  -webkit-appearance: none;
}
</style>
