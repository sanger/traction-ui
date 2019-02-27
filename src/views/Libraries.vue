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
      let rawResponse = await this.libraryRequest.destroy(this.selected)
      let responses = rawResponse.map(item => new Api.Response(item))

      if (responses.every(r => Object.keys(r.errors).length === 0)) {
        this.message = `Libraries ${this.selected.join(',')} successfully deleted`
      } else {
        this.message = responses.map(r => r.errors.message)
      }
      this.showAlert
    },
    async getLibraries () {
      let rawResponse = await this.libraryRequest.get()
      let response = new Api.Response(rawResponse)

      if (Object.keys(response.errors).length === 0) {
        let libraries = response.deserialize.libraries
        return libraries
      } else {
        this.message = response.errors.message
        this.showAlert
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
