<template>
  <div class="speciePicker">
    <div class="search-card">
      <label for="search">Search species :</label>
      <input type="text" name="search"
        id="search"
        v-model="searchInput">
    </div>
    <div class="discipline">
      <form>
        <ul>
          <li :class="{ checked: discipline === 'all'}">
            <input v-model="discipline" type="radio" id="all" name="discipline" value="all">
            <label for="all">All</label>
          </li>
          <li :class="{ checked: discipline === 'flora'}">
            <input v-model="discipline" type="radio" id="flora" name="discipline" value="flora">
            <label for="flora">Flora</label>
          </li>
          <li :class="{ checked: discipline === 'fauna'}">
            <input v-model="discipline" type="radio" id="fauna" name="discipline" value="fauna">
            <label for="fauna">Fauna</label>
          </li>
          <li :class="{ checked: discipline === 'marine'}">
            <input v-model="discipline" type="radio" id="marine" name="discipline" value="marine">
            <label for="marine">Marine</label>
          </li>
        </ul>
      </form>
    </div>
    <ul class="collection">
      <li v-for="suggestion in species">
        <specieSearchItem
          :commonName="suggestion.commonName"
          :scientificName="suggestion.scientificName"
          :conservationStatus="suggestion.conservationStatus.vicAdvisory"
          :imageSource="get(suggestion, 'images[0].s3Url')"
          @click.native="select(suggestion)"
        ></specieSearchItem>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import vbaSpecies from '@/api/vbaSpecies';
import { debounce, get } from 'lodash'; // eslint-disable-line
import specieSearchItem from './specieSearchItem';
// import card from './card';


export default {
  name: 'speciePicker',
  components: {
    specieSearchItem,
  },
  data () {
    return {
      obsId: Number(this.observationId),
      species: [],
      searchInput: undefined,
      discipline: null,
    };
  },
  props: {
    observationId: {
      type: [Number, String],
      default () { return undefined; },
    },
  },
  watch: {
    // eslint-disable-next-line
    searchInput: function () { this.searchSpecie() },
    // eslint-disable-next-line
    discipline: function () { this.searchSpecie() },
  },
  methods: {
    ...mapActions([
      'selectSpecie',
    ]),
    // eslint-disable-next-line
    searchSpecie: debounce(
      function searchSpecie () {
        const inputString = this.searchInput;
        const discipline = this.discipline;
        if (!inputString) return;
        vbaSpecies(inputString, discipline)
          .then((response) => {
            this.$data.species = response;
          });
      }, 500),
    select (specie) {
      const obsId = this.obsId;
      console.log(specie, obsId);
      this.$store.dispatch('selectSpecie', { specie, obsId });
      this.$data.searchInput = specie;
      this.$router.go(-1);
    },
    get (object, path) {
      return get(object, path);
    },
  },
};
</script>

<style scoped>
.discipline {
  position: relative;
  font-size: 1.2rem;
  line-height: 2rem;
}

.discipline::before {
  background: rgba(0, 0, 0, .1 );
  bottom: 0;
  content: '';
  height: 0.125rem;
  left: 0;
  position: absolute;
  right: 0;
}

.discipline ul {
  display: flex;
  justify-content: space-around;
  margin: .5rem;
}

.discipline li {
  display: flex;
  padding: 0 .2rem 0 .2rem;
  border-bottom: 0.125rem solid rgba(0, 0, 0, 0 );
  transition: all 0.35s ease;
}

.discipline input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  visibility:hidden;
  margin: 0;
}

.discipline .checked{
  border-bottom: 0.125rem solid #00b7bd;
}



.thumbnail {
  max-width: 10rem;
}

.description {
  width: 12rem;
}

.taxon-card {
  display: flex;
  justify-content: space-between;
}

.description {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-svg {
  margin-left: auto;
}

.search-card{
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.search-card input {
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
  -webkit-appearance: textfield;
}

.speciePicker {
  margin: .5rem;
}

.collection {
  background: white;
}

.taxon-card {
  padding: .5rem;
  border-bottom: 1px solid #c9c9c9;
}

.collection li:nth-child(even) {
  background-color: #f7f7f7;
}
</style>
