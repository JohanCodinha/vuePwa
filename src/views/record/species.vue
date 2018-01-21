<template>
  <div class="species">
    <div class="taxonomy">
      <dl>
        <dd class="commonName">{{commonName}}</dd>
        <dd>{{scientificName}}</dd>
      </dl>
    </div>
    <div v-if="comments" class="comments">
      <dl class="inline">
        <dt>comments</dt>
        <dd>{{comments}}</dd>
      </dl>
    </div>
    <div class="observer">
      <dl class="inline">
        <dt>observed by</dt>
        <dd>{{observer}}</dd>
      </dl>
    </div>
    <div class="count, inline">
      <dl class="inline">
        <dt>count</dt>
        <dd>{{count}}</dd>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  name: 'species',
  props: {
    commonName: {
      type: String,
    },
    scientificName: {
      type: String,
    },
    count: {
      type: Number,
    },
    observer: {
      type: String,
    },
    type: {
      type: String,
    },
    countAccuracy: {
      type: String,
    },
    reliability: {
      type: String,
    },
    comments: {
      type: String,
    },
  },
  computed: {
  },
};
</script>

<style lang="scss">
.species {
  padding: 1rem;
  background: white;
}

.taxonomy {
  padding: 1rem 0;
  .commonName {
    text-transform: uppercase;
    font-size: 1.5rem;
    color: #2196f3;
  }
}

dl.inline {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  width: 100%; /* set the container width*/
  overflow: visible;
}
dl.inline dt {
  flex: 0 0 50%;
  text-overflow: ellipsis;
  overflow: hidden;
  text-transform: capitalize;
  &:after {
    content: ': ';
  }
}
dl.inline dd {
  margin-left: auto;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 0 0 50%
}
</style>
