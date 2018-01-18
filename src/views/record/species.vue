<template>
  <div class="species">
    <div class="taxonomy">
      <dl>
        <dd>{{commonName}}</dd>
        <dd>{{scientificName}}</dd>
      </dl>
    </div>
    <div class="observer">
      <dl>
        <dt>observed by</dt>
        <dd>{{observer}}</dd>
      </dl>
    </div>
    <div class="count">
      <dl>
        <dt>count</dt>
        <dd>{{count}}</dd>
        <dt>accuracy</dt>
        <dd>{{countAccuracy}}</dd>
      </dl>
    </div>
    <div class="comments">
      <p>{{comments}}</p>
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

<style lang="">

</style>
