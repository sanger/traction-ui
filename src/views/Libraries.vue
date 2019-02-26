<template>
  <div class="libraries">
    <alert ref='alert'></alert>

    <b-table
       show-empty
       :items="provider"
       :fields="fields"
    >
      <template slot="selected" slot-scope="row">
        <input type="checkbox" class="selected" v-model="selected" :value="row.item.id" />
      </template>
    </b-table>

    <b-button id="deleteLibraries" @click="deleteLibraries" class="float-right">Delete Libraries</b-button>
  </div>
</template>

<script>

import Alert from '@/components/Alert'
import ComponentFactory from '@/mixins/ComponentFactory'
import Api from '@/api'

export default {
  name: 'Libraries',
  mixins: [ComponentFactory],
  props: {
  },
  data () {
    return {
      fields: [
        { key: 'selected', label: '' },
        { key: 'id', label: 'Library ID' },
        { key: 'barcode', label: 'Barcode' },
        { key: 'sample_name', label: 'Sample Name' },
        { key: 'enzyme_name', label: 'Enzyme Name' }
      ],
      selected: [],
      message: ''
    }
  },
  components: {
    Alert
  },
  methods: {
    async deleteLibraries () {
      let remoteResponse = await this.libraryRequest.destroy(this.selected)
      let response = new Api.Response(remoteResponse)

      if (response.successful) {
        this.message = `Libraries ${this.selected.join(',')} successfully deleted`
      } else {
        this.message = 'There was an error'
      }
    },
    async getLibraries () {
      try {
        let libraries = await this.libraryRequest.get()
        return new Api.Response(libraries).deserialize.libraries
      } catch(error) {
        return []
      }
    },
    provider() {
      return this.getLibraries()
    }
  },
  computed: {
    libraryRequest () {
      return this.build(Api.Request, this.tractionConfig.resource('libraries'))
    },
    tractionConfig () {
      return this.build(Api.ConfigItem, Api.Config.traction)
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  }
}

</script>
