<template>
  <li class="card">
    <div v-if="this.$slots['image']" class="image">
      <slot name="image"></slot>
    </div>
    <div class="card-content_">
      <div class="visible-content">
        <slot name="content"></slot>
        <div v-if="this.$slots['reveal']">
          <i @click.stop="cardReveal" class="material-icons">more_vert</i>
        </div>
      </div>
      <div class="card-reveal_" v-bind:class="{'card-revealed': cardRevealed}">
        <div class="card-reveal-content">
          <slot name="reveal"></slot>
          <div>
            <i @click.stop="cardHide" class="material-icons">close</i>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'card',
  props: {
    triggerReveal: false,
  },
  data () {
    return {
      cardRevealed: false,
    };
  },
  methods: {
    cardReveal () {
      this.$data.cardRevealed = true;
    },
    cardHide () {
      this.$data.cardRevealed = false;
    },
  },
  watch: {
    triggerReveal: function triggerReveal () {
      this.$data.cardRevealed = false;
    },
  },
};
</script>

<style scoped>
.card {
  box-shadow: 
    0 2px 2px 0 rgba(0,0,0,0.14),
    0 1px 5px 0 rgba(0,0,0,0.12),
    0 3px 1px -2px rgba(0,0,0,0.2);
  transition: box-shadow .25s, -webkit-box-shadow .25s;
  border-radius: 2px;
  position: relative;
  // margin: .5rem 0 0 0;
  background-color: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-content_ {
  width: 100%;
  position: relative;
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  flex-direction: column;
}

.visible-content{
  justify-content: space-between;
  flex: 1;
  display: flex;
  flex-direction: row;
  margin: .5rem;
}

.card-reveal_ {
  display: flex;
  justify-content: space-between;
  position: absolute;
  background-color: #fff;
  width: 100%;
  height: 100%;
  top: 100%;
  bottom:  0;
  transition: transform .3s;
}

.card-reveal-content{
  display: flex;
  justify-content: space-between;
  flex: 1;
  margin: .5rem;
}


.card-revealed {
  visibility: visible;
  display: flex;
  transform: translateY(-100%);
}

.btn {
  text-decoration: none;
  color: #fff;
  background-color: #26a69a;
  text-align: center;
  letter-spacing: .5px;
  border: none;
  border-radius: 2px;
  display: inline-block;
  height: 36px;
  line-height: 36px;
  padding: 0 2rem;
  text-transform: uppercase;
}

.red_ {
  background-color: #D32F2F;
}

.image {
  display: flex;
  justify-content: center;
}
.image img {
  max-height: 40vh;
  object-fit: contain;
  height: 100%;
  width: 100%;
}

.material-icons {
  color: black;
}

dt::after { 
  content: ' :';
}
dd {
  padding-left: 1rem;
}
</style>
