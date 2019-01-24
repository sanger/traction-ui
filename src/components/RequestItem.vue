<template>
  <tr>
    <td><input class="selected" type="checkbox" v-model="selected" /></td>
    <td>{{ id }}</td>
    <td>{{ name }}</td>
    <td>{{ sample_common_name }}</td>
    <td>{{ sanger_sample_id }}</td>
    <td>{{ state }}</td>
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
    sample_common_name: {
      type: String
    },
    sanger_sample_id: {
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
  methods: {
  },
  computed: {
    json () {
      return { 
        sequencescape_request_id: this.id,
        name: this.name,
        species: this.sample_common_name
      }
    }
  }
}
</script>

<style>
</style>
