<template>
  <div class="samples">
    <b-table
       show-empty
       :items="items"
       :fields="fields"
    >
      <template slot="selected" slot-scope="row">
        <input type="checkbox" class="selected" v-model="selected" :value="row.item" />
      </template>
    </b-table>

    <modal @selectEnzyme="createLibrariesInTraction" :disabled="this.selected.length === 0" class="float-right" ></modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal'
import handlePromise from '@/api/PromiseHelper'
import Api from '@/mixins/api'

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
      message: ''
    }
  },
  methods: {
    async createLibrariesInTraction (selectedEnzymeId) {
      let libraries = this.selected.map(item => { return {'sample_id': item.id, 'enzyme_id': selectedEnzymeId}})

      let body = { data: { type: 'libraries', attributes: { libraries: libraries }}}

      let promise = this.libraryRequest.create(body)
      let response = await handlePromise(promise)

      if (response.successful) {
        let newLibrariesID = response.deserialize.libraries.map(l => l.id)
        let libraryText = newLibrariesID.length > 1 ? 'Libraries' : 'Library'
        this.message = `${libraryText} ${newLibrariesID.join(',')} created in Traction`
      } else {
        this.message = response.errors.message
      }
      this.emitAlert
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
  }
}
</script>
