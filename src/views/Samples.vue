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
      let tubes = await this.findTubes(this.tractionTubeRequest)
      if (tubes.every(t => t.material.type == "libraries")) {
        this.$router.push({name: 'Libraries', params: {items: tubes}})
      }
    },
    async findTubes (request) {
      if(!this.queryString) return

      let promise = request.get({filter: { barcode: this.queryString} })
      let response = await handlePromise(promise)

      if (response.successful) {
        if (response.empty) {
          this.message = 'No tubes found'
          return response
        } else {
          this.message = 'Tubes successfully found'
          return response.deserialize.tubes
        }
      } else {
        this.message = 'There was an error'
        return response
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
    emitAlert () {
      return this.$emit('alert', this.message)
    },
    tractionTubeRequest () {
      return this.api.traction.tubes
    },
    queryString () {
      if (this.barcodes === undefined || !this.barcodes.length) return ''
      return this.barcodes.split('\n').filter(Boolean).join(',')
    },
    getItems () {
      return this.items.map(i => Object.assign(i.material, {barcode: i.barcode}))
    }
  }
}
</script>
