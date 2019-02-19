<template>
  <div class="samples">
    <alert ref='alert'></alert>

    <b-table
       show-empty
       :items="getSamples"
       :fields="fields"
    >
      <template slot="selected" slot-scope="row">
        <b-checkbox @change="toggleSelectedRow(row.item)"></b-checkbox>
      </template>
    </b-table>

    <!-- Button to create libraries -->
    <!-- Add check to disable button if no samples are selected -->
    <modal @selectEnzyme="createLibraries" :disabled=false class="float-right" ></modal>

  </div>
</template>

<script>
import Alert from '@/components/Alert'
import ApiConfig from '@/api/Config'
import ConfigItem from '@/api/ConfigItem'
import ComponentFactory from '@/mixins/ComponentFactory'
import Request from '@/mixins/Request'
import Response from '@/api/Response'
import Modal from '@/components/Modal';

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
  created() {
  },
  methods: {
    toggleSelectedRow(item) {
      if (this.selected.indexOf(item) === -1) {
        this.selected.push(item)
      } else {
        this.selected.splice(this.selected.indexOf(item), 1 );
      }
    },
    async getSamples () {
      try {
        let rawSamples = await this.sampleRequest.get()
        return new Response(rawSamples).data.samples
      } catch {
        // log error
      }
    },
    async createLibraries (selectedEnzymeId) {
      try {
        await this.createLibrariesInTraction(selectedEnzymeId)
      } catch (error) {
        // log error
      } finally {
        this.showAlert
      }
    },
    async createLibrariesInTraction (selectedEnzymeId) {
      let libraryAttrs = []
      for (let i = 0; i < this.selected.length; i++) {
        let sampleId = this.selected[i].id
        let enzymeId = selectedEnzymeId
        libraryAttrs.push( {'sample_id': sampleId, 'enzyme_id': enzymeId} )
      }

      let body = { data: { type: 'libraries', attributes: { libraries: libraryAttrs }}}

      let rawResponse = await this.libraryRequest.create(body)
      let response = new Response(rawResponse)

      if (Object.keys(response.errors).length === 0) {
        this.message = 'Libraries created in Traction'
      } else {
        this.message = response.errors.message
        throw this.message
      }
    },
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
  },
  components: {
    Alert,
    Modal
  },
  computed: {
    sampleRequest () {
      return this.build(Request, this.tractionConfig.resource('samples'))
    },
    libraryRequest () {
      return this.build(Request, this.tractionConfig.resource('libraries'))
    },
    tractionConfig () {
      return this.build(ConfigItem, ApiConfig.traction)
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  }
}
</script>
