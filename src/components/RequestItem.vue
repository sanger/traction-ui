<template>
  <tr>
    <td><input class="selected" type="checkbox" v-model="selected" /></td>
    <td>{{ id }}</td>
    <td>{{ name }}</td>
    <td>{{ species }}</td>
  </tr>
</template>

<script>

export default {
  name: 'RequestItem',
  props: {
    id: {
      type: [String, Number]
    },
    name: {
      type: String
    },
    species: {
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
        species: this.species
      }
    }
  }
}
</script>

<style>
</style>
