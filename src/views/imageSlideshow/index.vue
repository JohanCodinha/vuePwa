<template>
  <div class="container">
    <div class="slideshow">
      <div class="menu">
        <ul>
          <li v-if="infoPanel" @click="openInfoPanel">
            <svg width="24px" height="24px" class="icons" viewBox="0 0 24 24">
              <path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10c5.5,0,10-4.5,10-10S17.5,2,12,2z M13,17h-2v-6h2V17z M13,9h-2V7h2V9z">
              </path>
            </svg>
          </li> 
          <li @click="deleteImage">
            <svg width="24px" height="24px" class="icons" viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-12h-12v12zm13-15h-3.5l-1-1h-5l-1 1h-3.5v2h14v-2z"></path>
            </svg>
          </li> 
        </ul> 
      </div> 
      <div class="fullscreen">
        <img :src="heroImage">
      </div>
    </div>
    <div class="control">
    
    </div>
    <div class="infoPanel" :class="{ closeInfoPanel: !infoPanelOpen}">
      <div class="menu">
        <p>Info</p>
        <svg @click="closeInfoPanel" width="24px" height="24px" class="icons" viewBox="0 0 24 24">
          <path d="M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z">
          </path>
        </svg>
      </div>
      <h2>Details</h2>
      <div class="details">
        <dl>
          <div v-if="date && time">
            <dt>
              <svg width="24px" height="24px" class="icons" viewBox="0 0 24 24">
                <path d="M17 12h-5v5h5v-5zm-1-11v2h-8v-2h-2v2h-1c-1.11 0-1.99.9-1.99 2l-.01 14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2h-1v-2h-2zm3 18h-14v-11h14v11z">
                </path>
              </svg>
            </dt>
            <dd class="datetime">
              <p>{{date}}</p>
              <p>{{time}}</p> 
            </dd>
          </div>
          <div v-if="latitude && longitude">
            <dt>
              <svg width="24px" height="24px" class="icons" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z">
                </path>
              </svg>
            </dt>
            <dd>
              <div>
                <p>location</p>
              </div>
              <div class="coordinate">
                <p>{{formatedLatitude}}</p>
                <p>{{formatedLongitude}}</p> 
              </div>
            </dd>
          </div>
        </dl>
      </div>
      <div class="staticMap">
        <img :src="mapUrl"> 
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { format, parse } from 'date-fns';
import { get } from 'lodash';
import TOKEN from '@/api/token.json';

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
    imageId: {
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
    images () {
      const images = get(this.activeDraft, 'images');
      return images;
    },
    selectedImage () {
      const selectedImage = this.images.find(image => image.metadata.id === this.imageId);
      if (selectedImage) return selectedImage;
      return this.$router.push({ name: 'GeneralObs', params: { observationId: this.obsId } });
    },
    heroImage () {
      const imageData = get(this.selectedImage, 'data');
      if (imageData) {
        return URL.createObjectURL(imageData);
      }
      return undefined;
    },
    metadata () {
      return get(this.selectedImage, 'metadata');
    },
    date () {
      if (!this.metadata.datetime) return null;
      return format(parse(this.metadata.datetime), 'D MMM');
    },
    time () {
      if (!this.metadata.datetime) return null;
      return format(parse(this.metadata.datetime), 'ddd, HH:mm');
    },
    longitude () {
      return this.metadata.longitude;
    },
    latitude () {
      return this.metadata.latitude;
    },
    formatedLongitude () {
      if (!this.longitude) return null;
      return this.longitude.toString().slice(0, 8);
    },
    formatedLatitude () {
      if (!this.latitude) return null;
      return this.latitude.toString().slice(0, 8);
    },
    infoPanel () {
      if (this.latitude && this.longitude) return true;
      return false;
    },
    mapUrl () {
      const longitude = this.longitude;
      const latitude = this.latitude;
      const url = `https://api.mapbox.com/styles/v1/panelvw/cj4f5jcy500pw2rsetkub2wos/static/pin-s(${longitude},${latitude})/${longitude},${latitude},14/400x400?access_token=`;
      return url + TOKEN.mapbox;
    },
  },
  methods: {
    ...mapActionsObserve([
      'removeImage',
    ]),
    deleteImage () {
      this.removeImage({ obsId: this.obsId, imageId: this.selectedImage.metadata.id });
      this.infoPanelOpen = false;
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
  
  $grey: rgba(0,0,0,0.54);
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
    i, .icons {
      fill: white;
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .icons {
      fill: $grey;
    }

    .menu {
      justify-content: space-between;

      p {
        font-weight: 500;
        font-size: 20px;
      }
    }
    & > div, h2 {
      padding: 8px 20px 8px 32px;
    }
    h2 {
      font-weight: 500;
      font-size: .8rem;
      color: $grey;
    }
    .staticMap {
      max-width: 100vw;
      padding: 0;  
      display: flex;
      justify-content: flex-end;
      img {
        width: 100%;
        height: auto;
      }
    }

  }
  
  .closeInfoPanel {
    transform: translateX(100vw);
  }
  .details {
    display: flex;
    dl {
      display: flex;
      flex-direction: column;
      dt   {
        margin: 0 2rem 0 0;
      }
      div {
        display: flex;
        align-items: center;
        margin: .5rem 0 .5rem 0;
      }
    }
    .datetime{
      p:last-child {
        color: $grey;
      }
    }
    .coordinate {
      color: $grey;
      p:first-child:after {
        content: ", ";
        margin-right: .5rem;
      }
    }
  }
</style>
