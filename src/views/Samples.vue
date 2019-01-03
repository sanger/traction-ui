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
      <tbody>
        <data-list ref="samples" baseURL='http://localhost:3100' apiNamespace="v1" resource="samples">
          <div slot-scope="{ data: samples, errors, loading, load }">
            <sample-item v-for="sample in samples" v-bind:key="sample.id" v-bind="sample"></sample-item>
          </div>
        </data-list>
      </tbody>
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
