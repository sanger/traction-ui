<template>
  <tr>
    <td>{{ id }}</td>
    <well v-for="cell in buildCells()" v-bind:key="cell.column" v-bind="cell"></well>
  </tr>
</template>

<script>

import Well from '@/components/Well'

export default {
  name: 'Row',
  components: {
    Well
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    columns: {
      type: Array,
      required: true
    }
  },
  methods: {
    buildCells() {
      let self = this
      return self.columns.map(column => ({row: this.id, column: column}))
    }
  }
}
</script>
