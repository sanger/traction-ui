<template>
  <div class="samples">
    <alert ref='alert'></alert>

    <b-col md="6" class="my-1">
      <b-form-group label-cols-sm="3" label="Filter" class="mb-0">
        <b-input-group>
          <b-form-input v-model="filter" placeholder="Type to Search" />
          <b-input-group-append>
            <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
    </b-col>

    <b-table
       show-empty
       :items="items"
       :fields="fields"
       :filter="filter"
    >
      <template slot="selected" slot-scope="row">
        <input type="checkbox" class="selected" v-model="selected" :value="row.item" />
      </template>
    </b-table>

    <!-- Button to create libraries -->
    <!-- Add check to disable button if no samples are selected -->
    <modal @selectEnzyme="createLibrariesInTraction" :disabled=false class="float-right" ></modal>

  </div>
</template>

<script>
import Alert from '@/components/Alert'
import ComponentFactory from '@/mixins/ComponentFactory'
import Modal from '@/components/Modal'
import Api from '@/api'

export default {
  name: 'Samples',
  mixins: [ComponentFactory],
  props: {
  },
  data () {
    return {
      fields: [
        { key: 'selected', label: ''},
        { key: 'id', label: 'Sample ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'species', label: 'Species', sortable: true },
        { key: 'barcode', label: 'Barcode', sortable: true },
      ],
      selected: [],
      filter: null,
      items: []
    }
  },
  methods: {
    async getSamples () {
      let rawResponse = await this.sampleRequest.get()
      let response = new Api.Response(rawResponse)

      if (Object.keys(response.errors).length === 0) {
        let samples = response.deserialize.samples
        this.items = samples
      } else {
        this.message = response.errors.message
        this.showAlert
        this.items = []
      }
    },
    async createLibrariesInTraction (selectedEnzymeId) {
      let libraries = this.selected.map(item => { return {'sample_id': item.id, 'enzyme_id': selectedEnzymeId}})

      let body = { data: { type: 'libraries', attributes: { libraries: libraries }}}
      let rawResponse = await this.libraryRequest.create(body)
      let response = new Api.Response(rawResponse)

      if (response.successful) {
        this.message = 'Libraries created in Traction'
      } else {
        this.message = response.errors.message
      }
      this.showAlert
    },
    provider () {
      this.getSamples()
    }
  },
  components: {
    Alert,
    Modal
  },
  created() {
    this.provider()
  },
  computed: {
    sampleRequest () {
      return this.build(Api.Request, this.tractionConfig.resource('samples'))
    },
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
