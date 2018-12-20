<template>
  <div class="reception">
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
        <data-list ref="requests" resource="requests">
          <div slot-scope="{ data: requests, errors, loading }">
            <request-item v-for="request in requests" v-bind:key="request.id" v-bind:request="request"></request-item>
          </div>
        </data-list>
      </tbody>
    </table>
  </div>
</template>

<script>

import DataList from '@/api/DataList'
import RequestItem from '@/components/RequestItem'

export default {
  name: 'Reception',
  data () {
    return {
    }
  },
  created() {
  },
  methods: {
  },
  components: {
    DataList,
    RequestItem
  },
  computed: {
    // should this property be in DataList??
    selected () {
      return this.$refs.requests.$children.filter(request => request.selected)
    }
  }
}
</script>

<style lang="scss">
</style>
