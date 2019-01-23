<template>
  <div class="libraries">
    <alert ref='alert'></alert>
    <table class="table">
      <thead>
        <tr>
          <th></th>
          <th>Library ID</th>
          <th>Sample name</th>
          <th>Barcode</th>
          <th>State</th>
        </tr>
      </thead>
      <data-list ref="libraries" :baseURL="tractionBaseURL" apiNamespace="v1" resource="libraries">
        <tbody slot-scope="{ data: libraries }">
          <library-item v-for="library in libraries" v-bind:key="library.id" v-bind="library"></library-item>
        </tbody>
      </data-list>
    </table>
  </div>
</template>

<script>
import DataList from '@/api/DataList'
import Alert from '@/components/Alert'
import LibraryItem from '@/components/LibraryItem'

export default {
  name: 'Libraries',
  props: {
    tractionBaseURL: {
      type: String,
      default: process.env.VUE_APP_TRACTION_BASE_URL
    }
  },
  components: {
    DataList,
    LibraryItem,
    Alert
  }
}

</script>
