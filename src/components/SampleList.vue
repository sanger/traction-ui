<template>
  <table class="table">
    <thead>
      <tr>
        <th></th>
        <th>Sample ID</th>
        <th>Name</th>
        <th>Species</th>
        <th>State</th>
      </tr>
    </thead>
    <tbody>
      <sample-item v-for="sample in samples" v-bind:key="sample.id" v-bind:sample="sample"></sample-item>
    </tbody>
  </table>
</template>

<script>
import SampleItem from '@/components/SampleItem'

export default {
  name: 'SampleList',

  data () {
    return {
    }
  },
  props: {
    samples: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {
    SampleItem
  }
}
</script>

<style>
</style>
