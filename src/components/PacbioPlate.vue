<template>
  <div>
    <thead>
      <th>&nbsp;</th>
      <th v-for="column in columns" v-bind:key="column">{{ column}}</th>
    </thead>
    <row v-for="(key, row) in rows" v-bind:key="key" v-bind="row" v-bind:columns="columns"></row>
  </div>
</template>

<script>

export default {
  name: 'Plate',
  props: {
    wells: {
      type: Array,
      required: true
    },
    rowHeaders: {
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
    Test
  },
  computed: {
    rows () {
      return this.wells.reduce((objectsByKeyValue, obj) => {
        const value = obj['row']
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj)
        return objectsByKeyValue
      }, {})
    }
  }
}
</script>
