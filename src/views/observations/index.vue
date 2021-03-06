<template>
  <div :class="{ center: (logedIn && generalObs.length < 1)}" class="container">
    <div class="no-obs" v-if="logedIn && generalObs.length < 1">
      <p>We could not find any...</p>
      <router-link to='/observations/drafts'>
        let's get started
      </router-link>
    </div>
    <filtering-options>
    </filtering-options>
    <div class="content">
      <transition-group name="_obsCard-list" tag="ol" class="observationsList">
        <observation-card class="observationCard"
          v-for="record in displayedObservation"
          :taxonRecordedId="record.species[0] && record.species[0].id"
          :scientificName="record.species && record.species.length && record.species[0].scientificNme"
          :commonName="record.species && record.species.length && record.species[0].commonNme"
          :siteName="record.siteNme"
          :surveyId="record.surveyId"
          :status="record.expertReviewStatus"
          :startDate="record.surveyStartSdt"
          :key="record.surveyId">
        </observation-card> 
        <!--  <observation-card class="observationCard"
          v-for="record in records"
          :taxonRecordedId="record.taxonRecordedId"
          :scientificName="record.scientificNme"
          :commonName="record.commonNme"
          :siteName="record.surveyComponent.survey.site.siteNme"
          :surveyId="record.surveyComponent.survey.surveyId"
          :status="record.expertReviewStatus"
          :startDate="record.surveyComponent.survey.surveyStartSdt"
          :key="record.taxonRecordedId"> -->
        </observation-card>
      </transition-group>
      <div class="expand-trigger" v-if="numOfHidden > 0" @click="showMore">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M12.44 6.44L9 9.88 5.56 6.44 4.5 7.5 9 12l4.5-4.5z"/></svg>                
        <p>Show {{showMoreCount}} more observations</p>
      </div>
    </div>
  </div>
</template>

<script>
// import { createNamespacedHelpers } from 'vuex';
import { mapGetters, mapActions } from 'vuex';
import observationCard from './obsCard';
import filters from './filters';

// const { mapActions, mapGetters } = createNamespacedHelpers('observation');

export default {
  name: 'saved-observations',
  data () {
    return {
      numberOfDisplayedObs: 25,
      showMoreIncrement: 25,
    };
  },
  components: {
    'observation-card': observationCard,
    'filtering-options': filters,
  },
  computed: {
    ...mapGetters({
      observationsByDate: 'observation/observationsByDate',
      generalObs: 'observation/generalObs',
      records: 'observation/records',
      filters: 'observation/filters',
      logedIn: 'account/isLogin',
    }),
    filteredObservation () {
      const filteringFunctions = this.filters.map((filterName) => {
        if (filterName === 'draft') {
          return obs => obs.expertReviewStatus === 'Draft';
        }
        if (filterName === 'approved') {
          return obs => obs.expertReviewStatus === 'Approved';
        }
        if (filterName === 'deleted') {
          return obs => obs.expertReviewStatus === 'Deleted';
        }
        if (filterName === 'ready for review') {
          return obs => obs.expertReviewStatus === 'Ready for review';
        }
        return v => v;
      });
      return this.observationsByDate
        .filter(obs => filteringFunctions.every(f => f(obs)));
    },
    displayedObservation () {
      return this.filteredObservation.slice(0, this.numberOfDisplayedObs);
    },
    numOfHidden () {
      return this.filteredObservation.length - this.numberOfDisplayedObs;
    },
    showMoreCount () {
      return this.numOfHidden < this.showMoreIncrement
        ? this.numOfHidden
        : this.showMoreIncrement;
    },
  },
  methods: {
    ...mapActions({
      getGeneralObs: 'observation/getGeneralObs',
    }),
    editObservation (obsId) {
      this.$router.push({ name: 'GeneralObs', params: { observationId: obsId } });
    },
    deleteRecord (surveyId) {
      this.$store.dispatch('observation/deleteSurvey', surveyId);
    },
    showMore () {
      this.numberOfDisplayedObs += this.showMoreIncrement;
    },
  },
};
</script>

<style lang="scss" scoped>
  .observationsList {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .container {
    min-height: 100vh;
    padding-bottom: .5rem;
    display: flex;
    flex-direction: column;
  }

  .content {
    margin: .5rem .5rem 0 .5rem;
  }

  .loggedOut {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    div {
      margin: 1rem 0 1rem 0 
    }
    img {
      max-width: 25vw;
    }

    h1 {
      color: black;
      font-size: 2rem;
    }

    .button {
      display: inline-block;
      font-size: 1.2rem;
    }
  }

  .link {
    color: #00b7bd;
    text-decoration: underline;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
  }

  .center {
    align-items: center;
    justify-content: center;
  }

  .no-obs {
    font-size: 1.8rem;
  }

  .observationCard  {
    width: 49%;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    margin: .1rem;
    @media screen and (max-width:320px) {
      width: 100%; 
    }
    @media screen and (min-width:768px) {
      width: 32%; 
    }
    @media screen and (min-width:1024px) {
      width: 24.5%; 
    }
  }

 .obsCard-list-item {
    transition: all 10s;
    display: inline-block;
    margin-right: 10px;
  }
  .obsCard-list-enter, .obsCard-list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  .obsCard-list-leave-active {
    position: absolute;
  }
  .obsCard-list-move {
    transition: transform 2s;
  }
  .expand-trigger {
    display: flex;
    background: white;
    padding: 1rem;
    box-shadow: 0 0 2px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.24);

    svg {
      margin-right: 1rem;
    }
  }
</style>
