<template>
  <li class="specie-li">
    <div class="avatar">
      <img v-if="imageSource" :src="'https://res.cloudinary.com/vba/image/fetch/w_300,f_auto/' + imageSource">
    </div>
    <div class="text-container">
      <div class="taxonomy">
        <p class="common-name">{{commonName}}</p>
        <p>{{scientificName}}</p>
      </div>
      <p v-if="records.length">Count: {{records.reduce((acc, r) => { return (r.totalCountInt || 1 ) + acc}, 0)}}</p>
      <p v-if="conservationStatus" class="status">{{conservationStatus}}</p>
    </div>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    commonName: {
      type: String,
      default () { return ''; },
    },
    conservationStatus: {
      type: String,
      default () { return false; },
    },
    scientificName: {
      type: String,
      default () { return ''; },
    },
    imageSource: {
      type: String,
      default () { return ''; },
    },
    records: {
      type: Array,
      default () { return []; },
    },
  },
  methods: {
  },
  computed: {

  },
};
</script>

<style scoped>
.specie-li {
  display: flex;
  align-items: center;
  height: 15vh;
  padding: .5rem;
}

.text-container {
  display: flex;
  flex-direction: column; 
  justify-content: space-between;
  flex: 1;
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 25vw;
  min-width: 25vw;
  height: 100%;
  max-height: 100%;
  margin-right: .5rem;
}

.avatar img {
  height: auto;
  max-width: 100%;
  max-height: 100%;
  mix-blend-mode: multiply;
}

.taxonomy {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  white-space: normal;
}

.common-name {
  font-size: 1.3rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-row {
  white-space: nowrap;
  display: flex;
  justify-content: space-between;
}

.observation {
  display: flex;
  justify-content: space-between;
}

.observation p:first-child {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status {
  background-color: #cedc00;
  font-weight: 500;
  padding: 0 5px 0 5px;
  border-radius: 5px;
  /*flex: 0 0 auto;*/
  /*flex-grow: 0;*/
  display: flex;
  /*display: flex;*/
  justify-content: flex-end;
  align-items: flex-end;
}

</style>
