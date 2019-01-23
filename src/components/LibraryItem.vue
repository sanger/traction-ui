<template>
  <tr>
    <td><input class="selected" type="checkbox" v-model="selected" /></td>
    <td>{{ id }}</td>
    <td>{{ sampleName }}</td>
    <td>{{ barcode }}</td>
    <td>{{ state }}</td>
  </tr>
</template>

<script>

export default {
  name: 'LibraryItem',
  props: {
    id: {
      type: [String, Number]
    },
    sampleName: {
      type: String
    },
    barcode: {
      type: String
    },
    state: {
      type: String
    }
  },
  data () {
    return {
      selected: false
    }
  },
  computed: {
    json () {
      return {
        id: this.id,
        sampleName: this.sampleName,
        barcode: this.barcode,
        state: this.state,
      }
    }
  }
}


</script>
