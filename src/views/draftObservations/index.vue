<template>
  <div :class="{center: !observations.length}" class="container">
    <div class="description">
      <p v-if="!observations.length">Contribute by adding a</p>
      <a class="button"  @click='newObservation'>
        <i class="material-icons">add_circle</i>
        <p>New general observation</p>
      </a>
    </div>
    <ul>
      <draft-observation-card v-for="obs in observations"
        :obsId="obs.id"
        :specieName="obs.taxonomy.commonName"
        :siteName="obs.position.description"
        :image="obs.images[0]"
        :status="obs.recordedId === undefined ? 'Local draft': 'Uploaded'"
        :key="obs.id">
      </draft-observation-card>
    </ul>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import draftObservationCard from './draftObsCard';

const { mapGetters: mapGettersObserve } = createNamespacedHelpers('observe');
export default {
  name: 'observations-list',
  data () {
    return {
      msg: 'Welcome to VBAS',
    };
  },
  components: {
    // 'observation-card': observationCard,
    'draft-observation-card': draftObservationCard,
  },
  computed: {
    ...mapGettersObserve({
      // generalObs: 'general',
      observations: 'allitems',
    }),
    // observations () {
    //   return this.$store.state.newObservations.items;
    // },
  },
  methods: {
    // ...mapActions([
    // ]),
    async newObservation () {
      this.$router.push({ name: 'GeneralObs' });
    },
    editObservation (obsId) {
      this.$router.push({ name: 'GeneralObs', params: { observationId: obsId } });
    },
    deleteRecord (surveyId) {
      this.$store.dispatch('deleteSurvey', surveyId);
    },
  },
};
</script>

<style scoped>
.container {
  margin: 0 .5rem 0 .5rem;
  padding-bottom: .5rem;
  display: flex;
  flex-direction: column;
}

.button {
  text-transform: none;
  padding: 0 1rem;
  box-shadow: 
  0 2px 2px 0 rgba(0,0,0,0.14),
  0 1px 5px 0 rgba(0,0,0,0.12),
  0 3px 1px -2px rgba(0,0,0,0.2);
  width: 100%;
}

.button p {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1rem;
}

.description > p {
  font-size: 2rem;
  margin: 1rem;
  text-align: center;
}

h1 {
  font-size: 1.8rem
}

.center {
  justify-content: center;
  align-items: center;
}
</style>
