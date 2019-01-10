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
        sequencescape_request_id: this.id,
        name: this.name,
        species: 'mockSpeciesForSS' // TODO: currently stubbed species from SS
      }
    }
  }
}
</script>

<style>
</style>
