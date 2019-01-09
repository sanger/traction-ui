<template>
  <table class="table">
    <thead>
      <tr>
        <th></th>
        <th>Request ID</th>
        <th>Name</th>
        <th>Species</th>
      </tr>
    </thead>
    <tbody>
      <request-item v-for="request in requests" v-bind:key="request.id" v-bind:request="request"></request-item>
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
    requests: {
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
