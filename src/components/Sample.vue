<template>
  <tr>
    <td><input type="checkbox" v-model="selected" /></td>
    <td>{{ sample.id }}</td>
    <td>{{ sample.name }}</td>
    <td>{{ sample.species }}</td>
  </tr>

</template>

<script>

export default {
  name: 'Sample',
  props: [
    'sample'
  ],
  data () {
    return {
      selected: false
    }
  }
}

</script>

<style>
</style>
