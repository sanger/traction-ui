<template>
  <div>
    <thead>
      <th>&nbsp;</th>
      <th v-for="column in columns" v-bind:key="column">{{ column}}</th>
    </thead>
    <row v-for="row in rows" v-bind:key="row" v-bind:id="row" v-bind:columns="columns"></row>
  </div>
</template>

<script>

import Row from '@/components/Row'

export default {
  name: 'Plate',
  props: {
    rows: {
      type: Array,
      default: () => {
        return ['A','B','C','D','E','F','G','H']
      }
    },
    columns: {
      type: Array,
      default: () => {
        return [1,2,3,4,5,6,7,8,9,10,11,12]
      }
    }
  },
  components: {
    Row
  },
}
</script>
