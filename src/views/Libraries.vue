<template>
  <div class="libraries">
    <alert ref='alert'></alert>

    <b-col md="6" class="my-1">
      <b-input-group>
        <b-form-input v-model="filter" placeholder="Type to Filter" />
        <b-input-group-append>
          <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-col>

    <b-table
       show-empty
       :items="items"
       :fields="fields"
       :filter="filter"
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
        { key: 'id', label: 'Library ID', sortable: true },
        { key: 'created_at', label: 'Created at', sortable: true },
        { key: 'barcode', label: 'Barcode', sortable: true },
        { key: 'sample_name', label: 'Sample Name', sortable: true },
        { key: 'enzyme_name', label: 'Enzyme Name', sortable: true }
      ],
      selected: [],
      message: '',
      filter: null,
      items: []
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
        this.items = libraries
      } else {
        this.message = response.errors.message
        this.showAlert
        this.items = []
      }
    },
    provider() {
      this.getLibraries()
    }
  },
  created() {
    this.provider()
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
