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
          <th>Enzyme</th>
          <th>State</th>
        </tr>
      </thead>
      <data-list ref="libraries" v-bind="tractionConfig.resource('libraries')">
        <tbody slot-scope="{ data: libraries }">
          <library-item v-for="library in libraries" v-bind:key="library.id" v-bind="library"></library-item>
        </tbody>
      </data-list>
    </table>
    <b-button id="deleteLibrary" @click="deleteLibrary" class="float-right">Delete Library</b-button>
  </div>
</template>

<script>
import DataList from '@/api/DataList'
import DataModel from '@/api/DataModel'
import Alert from '@/components/Alert'
import LibraryItem from '@/components/LibraryItem'
import ApiConfig from '@/api/Config'
import ConfigItem from '@/api/ConfigItem'
import ComponentFactory from '@/mixins/ComponentFactory'
import Request from '@/mixins/Request'
import Response from '@/api/Response'

export default {
  name: 'Libraries',
  mixins: [ComponentFactory],
  props: {
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
    },
    async getLibraries () {
       try {
        let libraries = await this.libraryRequest.get()
        return new Response(libraries).deserialize.libraries
      } catch(error) {
        return error
      }
    }
  },
  computed: {
    selected () {
      return this.$refs.libraries.$children.filter(library => library.selected).map(library => library.json)
    },
    libraryRequest () {
      return this.build(Request, this.tractionConfig.resource('libraries'))
    },
    tractionConfig () {
      return this.build(ConfigItem, ApiConfig.traction)
    },
    tractionApi () {
      return this.build(DataModel, this.tractionConfig.resource('libraries'))
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  }
}

</script>
