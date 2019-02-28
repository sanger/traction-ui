<template>
  <div class="samples">
    <alert ref='alert'></alert>

    <b-table
       show-empty
       :items="provider"
       :fields="fields"
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
        { key: 'selected', label: '' },
        { key: 'id', label: 'Sample ID' },
        { key: 'name', label: 'Name' },
        { key: 'species', label: 'Species' },
        { key: 'barcode', label: 'Barcode' },
      ],
      selected: []
    }
  },
  created () {
  },
  methods: {
    async getSamples () {
      let rawResponse = await this.sampleRequest.get()
      let response = new Api.Response(rawResponse)

      if (Object.keys(response.errors).length === 0) {
        let samples = response.deserialize.samples
        return samples
      } else {
        this.message = response.errors.message
        this.showAlert
        return []
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
      return this.getSamples()
    }
  },
  components: {
    Alert,
    Modal
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
