<template>
  <div id="container">
    <div class="taxonomy">
      <div class="names">
        <h1>{{species.scientificName}}</h1>
        <h2>{{species.commonName}}</h2>
      </div>
    </div>
    <imgSlider :images="species.images" class="imgSlider"></imgSlider>
    <dl v-if="description" class="descripton">
      <div v-if="description.habitat">
        <dt>Habitat</dt>
        <dd>{{description.habitat}}</dd>
      </div>
      <div v-if="description.biology">
        <dt>Biology</dt>
        <dd>{{description.biology}}</dd>
      </div>
      <div v-if="description.distribution">
        <dt>Distribution</dt>
        <dd>{{description.distribution}}</dd>
      </div>
    </dl>
    <dl>
      <div v-if="commonNameSynonyme">
        <dt>Common name synonyme</dt>
        <dd>{{commonNameSynonyme}}</dd>
      </div>
      <div v-if="scientificNameSynonyme">
        <dt>Scientific name synonyme</dt>
        <dd>{{scientificNameSynonyme}}</dd>
      </div>
    </dl>
    <h3 v-if="observation" class="margin-left">Observation : </h3>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import imgSlider from './imgSlider';

const { mapGetters } = createNamespacedHelpers('explore');

export default {
  components: {
    imgSlider,
  },
  props: {
    taxonId: {
      type: [String, Number],
    },
  },
  data () {
    const data = { // eslint-disable-line no-unused-vars
    };
    return data;
  },
  computed: {
    ...mapGetters([
      'speciesByTaxonId',
    ]),
    species () {
      return this.speciesByTaxonId(this.taxonId);
    },
    description () {
      return this.species.description;
    },
    observation () {
      return null;
    },
    scientificNameSynonyme () {
      return this.species.scientificNameSynonyme
        ? this.species.scientificNameSynonyme.join(', ')
        : null;
    },
    commonNameSynonyme () {
      return this.species.commonNameSynonyme
        ? this.species.commonNameSynonyme.join(', ')
        : null;
    },
  },
  methods: {
    close () {
      console.log('closing details page');
      this.$store.dispatch('setSpecieDetail', null);
    },
  },
};
</script>

<style lang="scss" scoped>
  .taxonomy {
    padding: .5rem 1rem .5rem 1rem;
  }
  dl {
    padding: 1rem;
    div {
      margin-top: .5rem;
      margin-bottom: .5rem;
    }
    dd {
      display: inline;
      font-size: 1.1rem;
    }
    dt {
      display: inline;
      color: rgba(0,0,0,.54);
      &:after {
        content: ": ";
      }
    }
  }
  .imgSlider {
  }
  #container {
    background-color: white;
    margin: .5rem;
    border-radius: 2px;
  }

  .images {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36vh;
  }

  .images img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
    overflow: auto;
  }

  .nav-button {
    display: flex;
    max-width: 10vw;
    color: white;
    justify-content: center;
    background-color: rgba(128,128,128,.4);
  }

  .taxonomy {
    display: flex;
    flex-direction: row;
  }

  .description {
    margin: 1rem;
  }

  .margin-left {
    margin-left: 1rem;
  }

</style>

<style>
#data-list {
  margin-left: 1rem;
  margin-right: 1rem;
  padding: 0;
}
#data-list .dropdown-title i {
  color: red;
}

#data-list .li .md-button-ghost {
  background: none;
}

#data-list span {
  color: #201547;
  font-weight: 500;
}

#data-list i {
  color: #00b7bd;
}
#data-list .md-active span {
  color: white;
  font-weight: 500;
}

#data-list .md-active i {
  color: white;
  font-weight: 500;
}
#data-list .md-active .li-container {
  background-color: #00b7bd;
}

#data-list .li-expand:after {
  height: 0;
}

</style>
