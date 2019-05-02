<template>
  <div class="samples">
    <b-table
       show-empty
       :items="getItems"
       :fields="fields"
    >
      <template slot="selected" slot-scope="row">
        <input type="checkbox" class="selected" v-model="selected" :value="row.item" />
      </template>
    </b-table>

    <modal @selectEnzyme="handleLibraryCreate" :disabled="this.selected.length === 0" class="float-right" ></modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal'
import handlePromise from '@/api/PromiseHelper'
import Api from '@/mixins/Api'
import getTubesForBarcodes from '@/api/TubeRequests'

export default {
  name: 'Samples',
  mixins: [Api],
  props: {
    items: Array
  },
  data () {
    return {
      fields: [
        { key: 'selected', label: ''},
        { key: 'id', label: 'Sample ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'species', label: 'Species', sortable: true },
        { key: 'barcode', label: 'Barcode', sortable: true },
        { key: 'created_at', label: 'Created at', sortable: true },
        { key: 'deactivated_at', label: 'Deactivated at', sortable: true },
      ],
      selected: [],
      message: '',
      barcodes: ''
    }
  },
  methods: {
    async handleLibraryCreate (selectedEnzymeId) {
      await this.createLibrariesInTraction(selectedEnzymeId)
      await this.handleTractionTubes()
    },
    async createLibrariesInTraction (selectedEnzymeId) {
      let libraries = this.selected.map(item => { return {'sample_id': item.id, 'enzyme_id': selectedEnzymeId}})

      let body = { data: { type: 'libraries', attributes: { libraries: libraries }}}

      let promise = this.libraryRequest.create(body)
      let response = await handlePromise(promise)

      if (response.successful) {
        let newLibrariesID = response.deserialize.libraries.map(l => l.id)
        let libraryText = newLibrariesID.length > 1 ? 'Libraries' : 'Library'
        this.message = `${libraryText} ${newLibrariesID.join(',')} created in Traction`
        this.barcodes = response.deserialize.libraries.map(l => l.barcode).join('\n')
        return response
      } else {
        this.message = response.errors.message
        return response
      }
    },
    async handleTractionTubes () {
      if (this.barcodes === undefined || !this.barcodes.length) {
        this.message = 'There are no barcodes'
        return
      }

      let response = await getTubesForBarcodes(this.barcodes, this.tractionTubeRequest)
      if (response.successful && !response.empty) {
        let tubes = response.deserialize.tubes
        if (tubes.every(t => t.material.type == "libraries")) {
          this.$router.push({name: 'Libraries', params: {items: tubes}})
        }
      } else {
        this.message = 'There was an error'
      }
    }
  },
  components: {
    Modal
  },
  computed: {
    libraryRequest () {
      return this.api.traction.libraries
    },
    tractionTubeRequest () {
      return this.api.traction.tubes
    },
    emitAlert () {
      return this.$emit('alert', this.message)
    },
    getItems () {
      return this.items.map(i => Object.assign(i.material, {barcode: i.barcode}))
    }
  }
}
</script>
