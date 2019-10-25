<template>
  <tr>
    <td>{{ id }}</td>
    <well v-for="well in wells" v-bind:key="well.column" v-bind="well"></well>
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
    wells: {
      type: Array,
      required: true
    }
  }
}
</script>
