<template>
  <div>
    <explorer-map v-if="species.length"></explorer-map>
    <div class="container">
      <div v-if="!status.searched" class="description">
        <h1>Explore flora &amp; fauna near you </h1>
        <i class="material-icons">location_searching</i>
      </div>
      <template v-else>
        <div v-if="species" @click="searchSpecies" class="reload">
          <i class="material-icons">autorenew</i>
          <h1>{{species.length}} species found</h1>
        </div>
        <ul class="collection">
          <li v-for="suggestion in species">
            <specieSearchItem
              :commonName="suggestion.commonName"
              :scientificName="suggestion.scientificName"
              :conservationStatus="suggestion.conservationStatus.vicAdvisory"
              :imageSource="get(suggestion, 'images[0].s3Url')"
              :records="records.filter(r => r.taxonId === suggestion.taxonId)"
              @click.native="select(suggestion)"
            ></specieSearchItem>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { debounce, get } from 'lodash'; // eslint-disable-line
import specieSearchItem from '@/views/editGeneralObs/specieSearchItem';
import explorerMap from './explorerMap';

const { mapActions, mapGetters } = createNamespacedHelpers('explore');


export default {
  name: 'explore',
  components: {
    specieSearchItem,
    'explorer-map': explorerMap,
  },
  data () {
    return {
    };
  },
  props: {
  },
  watch: {
  },
  computed: {
    ...mapGetters([
      'species',
      'status',
      'records',
    ]),
  },
  methods: {
    ...mapActions([
      'searchSpecies',
    ]),
    get (object, path) {
      return get(object, path);
    },
    select (species) {
      console.log('madeit');
      this.$router.push({ name: 'speciesDetails', params: { taxonId: species.taxonId } });
    },
  },
  mounted: function mountedEvent () { this.searchSpecies(); },
};
</script>

<style scoped>
.description {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.container {
  margin: 0 .5rem 0 .5rem;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  height: 100%;
  overflow: auto;
}

.collection {
  background: white;
  max-width: 100%;
}

.collection li:nth-child(even) {
  background-color: #f7f7f7;
}

.reload {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: .5rem;
  min-height: 2rem;
}

.reload > i {
  margin-right: 2rem;
}
</style>
