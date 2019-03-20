<template>
  <div class="libraries">
    <b-table
       show-empty
       :items="items"
       :fields="fields"
    >
      <template slot="selected" slot-scope="row">
        <input type="checkbox" class="selected" v-model="selected" :value="row.item.id" />
      </template>
    </b-table>

    <b-button id="deleteLibraries" @click="deleteLibraries" :disabled="this.selected.length === 0" class="float-right">Delete Libraries</b-button>
  </div>
</template>

<script>
import Api from '@/api'
import store from '@/store/index'

export default {
  name: 'Libraries',
  props: {
    items: Array
  },
  data () {
    return {
      fields: [
        { key: 'selected', label: '' },
        { key: 'id', label: 'Library ID', sortable: true },
        { key: 'barcode', label: 'Barcode', sortable: true },
        { key: 'sample_name', label: 'Sample Name', sortable: true },
        { key: 'enzyme_name', label: 'Enzyme Name', sortable: true },
        { key: 'created_at', label: 'Created at', sortable: true },
        { key: 'deactivated_at', label: 'Deactivated at', sortable: true },
      ],
      selected: [],
      message: ''
    }
  },
  components: {
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
      this.emitAlert
    }
  },
  computed: {
    libraryRequest () {
      return store.getters.traction.libraries
    },
    emitAlert () {
      return this.$emit('alert', this.message)
    },
  }
}

</script>
