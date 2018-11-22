<template>
  <tr>
    <td></td>
    <td>{{ sample.id }}</td>
    <td>{{ sample.name }}</td>
    <td>{{ sample.species }}</td>
  </tr>
</template>

<script>

export default {
  name: 'Sample',
  props: [
    'sample',
  ]
}

</script>

<style>

</style>
