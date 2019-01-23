<template>
  <tr>
    <td><input class="selected" type="checkbox" v-model="selected" /></td>
    <td>{{ id }}</td>
    <td>{{ name }}</td>
    <td>{{ species }}</td>
    <td>{{ barcode }}</td>
  </tr>
</template>

<script>

export default {
  name: 'SampleItem',
  props: {
    id: {
      type: [String, Number]
    },
    name: {
      type: String
    },
    species: {
      type: String
    },
    barcode: {
      type: String
    }
  },
  data () {
    return {
      selected: false
    }
  },
  methods: {
  },
  computed: {
    json () {
      return {
        id: this.id,
        name: this.name,
        species: this.species,
        barcode: this.barcode,
      }
    }
  }
}

</script>

<style>
</style>
