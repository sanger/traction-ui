<template>
  <div class="samples">
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
      <data-list ref="samples" baseURL='http://localhost:3100' apiNamespace="v1" resource="samples">
        <tbody slot-scope="{ data: samples }">
          <sample-item v-for="sample in samples" v-bind:key="sample.id" v-bind="sample"></sample-item>
        </tbody>
      </data-list>
    </table>
  </div>
</template>

<script>
import DataList from '@/api/DataList'
import SampleItem from '@/components/SampleItem'

export default {
  name: 'Samples',
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
    SampleItem
  },
  computed: {
  }
}
</script>
