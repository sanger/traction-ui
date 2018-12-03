<template>
  <table class="table">
    <thead>
      <tr>
        <th></th>
        <th>Sample ID</th>
        <th>Name</th>
        <th>Species</th>
      </tr>
    </thead>
    <tbody>
      <request-item v-for="sample in samples" v-bind:key="sample.id" v-bind:sample="sample"></request-item>
    </tbody>
  </table>
</template>

<script>
import RequestItem from '@/components/RequestItem'

export default {
  name: 'RequestList',

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
    RequestItem
  }
}
</script>

<style>
</style>
