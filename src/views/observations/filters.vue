<template>
  <div v-if="generalObsCount > 0" class="menu">
    <div class="controls">
      <div class="menu-left">
        <p class="menu-item" >{{generalObsCount}} saved observations</p>
        <div class="filter-list">
          <i class="material-icons menu-item">tune</i>
          <ul>
            <!-- <li :class="{'active-filter-type': filterSelected === 'biota'}" @click="toggleFilterOptions('biota')">biota</li> -->
            <li :class="{'active-filter-type': filterSelected === 'observationStatus'}" @click="toggleFilterOptions('observationStatus')">status</li>
          </ul>
        </div>
      </div>
      <div class="menu-right">
        <i @click="refresh" class="material-icons menu-item">refresh</i>
      </div>
    </div>
    <div :style="optionsHeight" class="filter-options" ref="options">
      <ul>
        <li v-for="option in filters[filterSelected].options" @click="selectOption(option)">
          <i class="material-icons">radio_button_{{filters[filterSelected].selected  === option ? 'checked' : 'unchecked'}}</i>
          <p>{{option}}</p>
        </li>
      </ul>
      <div class="action">
        <p @click="done">done</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'filtering-options',
  data () {
    return {
      toggle: false,
      filterSelected: 'observationStatus',
      filters: {
        // biota: {
        //   selected: null,
        //   options: ['terrestrial fauna', 'aquatic fauna',
        // 'aquatic invertebrates', 'flora', 'marine'],
        // },
        observationStatus: {
          selected: null,
          options: ['approved', 'deleted', 'draft', 'ready for review'],
        },
      },
    };
  },
  props: {
  },
  computed: {
    ...mapGetters({
      generalObsCount: 'observation/generalObsCount',
    }),
    optionsHeight () {
      return this.toggle
        ? { /* height: `${this.$refs.options.scrollHeight}px` */ }
        : { height: '0px' };
    },
    selectedFilters () {
      const filters = Object.keys(this.filters);
      const selected = filters.map(key => this.filters[key])
        .map(filter => filter.selected)
        .filter(s => s !== null);
      return selected;
    },
  },
  methods: {
    ...mapActions({
      getGeneralObs: 'observation/getGeneralObs',
      updateFilters: 'observation/updateFilters',
    }),
    refresh () {
      this.getGeneralObs();
    },
    toggleFilterOptions (selected) {
      this.toggle = true;
      this.filterSelected = selected;
    },
    selectOption (option) {
      const filter = this.filters[this.filterSelected];
      filter.selected = filter.selected === option
        ? null
        : option;
    },
    done () {
      this.toggle = false;
    },
  },
  watch: {
    selectedFilters (selected) {
      this.$store.dispatch('observation/updateFilters', selected);
    },
  },
};
</script>

<style lang="scss">
 .menu {
    background-color: #00796B ;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    min-height: 2rem;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.12), 0 4px 4px rgba(0, 0, 0, 0.24);
    color: white;
    .menu-item {
      display: flex;
    }
    .menu-left {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .menu-right {
      display: flex;
      align-items: center;
    }
  }
  .controls {
    display: flex;
    padding: 1rem;
  }
  .filter-list {
    display: flex;
    margin-top: .3rem;
    ul {
      display: flex;
      align-items: center;
      li {
        font-weight: 500;
        text-transform: uppercase;
        opacity: 0.7;
        margin: 0 1rem 0 1rem;
      }
    }
    .active-filter-type {
      opacity: 1; 
    }
  }

  .filter-options {
    display: flex;
    flex-direction: column;
    transition: height .5s;
    overflow: hidden;
    background-color: white;
    color: #757575; 
    ul {
      padding: .5rem 0 .5rem 0;
      li {
        display: flex;
        align-items: center;
        padding-left: 1rem;
        min-height: 2rem;
        text-transform: capitalize;
        i {
          margin: .5rem;
        }
      }
    }
    .action {
      border-top: 1px solid #e0e0e0;
      p {
        display: flex;
        justify-content: flex-end;
        text-transform: uppercase;
        font-size: 16px;
        font-weight: 500;
        margin: .5rem;
        padding: .5rem .5rem .5rem 0;  
      }
    }
  }
</style>
