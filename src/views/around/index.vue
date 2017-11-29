<template>
  <div>
    <explorer-map v-if="species.length"></explorer-map>
    <div class="container">
      <div v-if="!status.searched" class="description">
        <h1>Explore flora &amp; fauna near you </h1>
        <i class="material-icons">location_searching</i>
      </div>
      <ol class="collection"v-else>
        <li v-if="species" class="reload">
          <p>{{species.length}} species found</p>
          <i @click="searchSpecies" class="material-icons">autorenew</i>
        </li>
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
      </ol>
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

<style lang="scss" scoped>
.description {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.container {
  margin: 0 .8rem 0 .8rem;
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  overflow: auto;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  z-index: 2;
}

.collection {
  background: white;
  max-width: 100%;
  z-index: 1;
  background: #eee;

  li {
    background: white;
    margin: 0 0 1px;
  }
}

.reload {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  min-height: 2rem;
  font-size: 1.2rem;
  font-weight: 500;
}

</style>
