<template>
  <div class="container">
    <div class="slideshow">
      <div class="menu">
        <ul>
          <li>
            <i class="material-icons"
               @click="openInfoPanel">info</i>
          </li> 
          <li>
            <i class="material-icons"
               @click="deleteButton" >delete</i>
          </li> 
        </ul> 
      </div> 
      <div class="fullscreen">
        <img :src="heroImage">
      </div>
    </div>
    <div class="infoPanel" :class="{ closeInfoPanel: !infoPanelOpen}">
      <div class="menu">
        <p>Infos</p>
        <i class="material-icons"
           @click="closeInfoPanel">close</i>
      </div>
      <h2>Details</h2>
      <div class="details">
      </div>
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
  name: 'imageSlideshow',
  data () {
    const data = {
      selectedImg: 0,
      infoPanelOpen: false,
    };
    return data;
  },
  props: {
    observationId: {
      type: [Number, String],
      default () { return undefined; },
    },
  },
  components: {
    // 'observation-card': observationCard,
  },
  computed: {
    ...mapGettersObserve([
      'getObservationById',
    ]),
    obsId () {
      return Number(this.observationId);
    },
    activeDraft () {
      return this.getObservationById(this.obsId);
    },
    thumbnails () {
      const draftObservation = this.activeDraft;
      if (draftObservation) {
        return draftObservation.images.map(image => URL.createObjectURL(image.data));
      }
      return [];
    },
    heroImage () {
      return this.thumbnails[this.selectedImg];
    },
  },
  methods: {
    ...mapActionsObserve([
      'removeImage',
    ]),
    deleteButton () {
      this.removeImage();
    },
    infoButton () {
      console.log('info clicked');
    },
    openInfoPanel () {
      this.infoPanelOpen = true;
    },
    closeInfoPanel () {
      this.infoPanelOpen = false;
    },
  },
};
</script>

<style lang="scss" scoped>
  .container{
    background-color: black;
  }

  .fullscreen {
    width: 100vw;
    margin-top: 2rem;
    img {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  .menu {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 8px 20px 8px 32px;
    i {
      margin: .5rem;
    }
  }

  ul {
    color: white;
    display: flex;
    justify-content: flex-end;

    li {
      margin: 0 .5rem 0 .5rem;  
    }
  }

  .infoPanel {
    background: white;
    bottom: 0;
    left: auto;
    overflow-y: auto;
    position: fixed;
    right: 0;
    top: 3.1rem;
    width: 100vw;
    transition: all ease-in .3s;
    transform: translateX(0vw);

    .menu {
      justify-content: space-between;

      p {
        font-weight: 500;
        font-size: 20px;
      }
    }
  }
  
  .closeInfoPanel {
    transform: translateX(100vw);
  }
</style>
