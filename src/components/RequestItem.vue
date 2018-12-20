<template>
  <tr>
    <td><input class="selected" type="checkbox" v-model="selected" /></td>
    <td>{{ request.id }}</td>
    <td>{{ request.name }}</td>
    <td>{{ request.species }}</td>
  </tr>

</template>

<script>

export default {
  name: 'RequestItem',
  props: [
    'request'
  ],
  data () {
    return {
      selected: false
    }
  },
  methods: {
    // select() {
    //   console.log("click!")
    //   // this.$store.commit('selectRequest', this.json)
    // }
  },
  computed: {
    // json () {
    //   return Object.assign(this.sample, { selected: this.selected })
    // }
  }
}

</script>

<style>
</style>
