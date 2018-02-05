<template>
  <ul>
    <li v-for="item in filterOptions">
      <slot :filterOption="item">
      </slot>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'filterOptionsList',
  props: {
    filterOptions: {
      type: Array,
      required: true,
    },
    selectedOption: {
      type: Object,
    }
  },
  computed: {
  },
};
</script>

<style lang="scss">
.filter-options {
  transition: height .5s;
  overflow: hidden;
  background-color: white;
  color: #757575; 
  ul {
    padding: .5rem 0 .5rem 0;
    li {
      display: flex;
      align-items: center;
      padding-left: 1rem;
      min-height: 2rem;
      text-transform: capitalize;
      i {
        margin: .5rem;
      }
    }
  }
  .action {
    border-top: 1px solid #e0e0e0;
    p {
      display: flex;
      justify-content: flex-end;
      text-transform: uppercase;
      font-size: 16px;
      font-weight: 500;
      margin: .5rem;
      padding: .5rem .5rem .5rem 0;  
    }
  }
}
</style>
