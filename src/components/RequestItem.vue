<template>
  <tr>
    <td><input type="checkbox" v-model="selected" v-on:click="select" /></td>
    <td>{{ sample.id }}</td>
    <td>{{ sample.name }}</td>
    <td>{{ sample.species }}</td>
  </tr>

</template>

<script>

export default {
  name: 'RequestItem',
  props: [
    'sample'
  ],
  data () {
    return {
      selected: false
    }
  },
  methods: {
    select() {
      this.$store.commit('selectRequest', this.json)
    }
  },
  computed: {
    json () {
      return Object.assign(this.sample, { selected: this.selected })
    }
  }
}

</script>

<style>
</style>
