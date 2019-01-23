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
    <b-button id="deleteLibrary" @click="deleteLibrary" class="float-right">Delete Library</b-button>
  </div>
</template>

<script>
import Vue from 'vue'
import DataList from '@/api/DataList'
import DataModel from '@/api/DataModel'
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
  },
  methods: {
    async deleteLibrary () {
      try {
        await this.deleteLibraryInTraction()
      } catch (error) {
        // log error
      } finally {
        this.showAlert
      }
    },
    async deleteLibraryInTraction () {
      for (let i = 0; i < this.selected.length; i++) {
        let id = this.selected[i].id
        await this.tractionApi.destroy(id)
      }
      if (this.tractionApi.data !== null) {
        this.message = 'Library deleted in Traction'
      } else {
        this.message = this.tractionApi.errors.message
        throw this.message
      }
    }
  },
  computed: {
    selected () {
      return this.$refs.libraries.$children.filter(library => library.selected).map(library => library.json)
    },
    tractionApi () {
      let Cmp = Vue.extend(DataModel)
      return new Cmp({ propsData: { baseURL: this.tractionBaseURL, apiNamespace: 'v1', resource: 'libraries' }})
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  }
}

</script>
