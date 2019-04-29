<template>
  <div class="libraries">
    <alert ref='alert'></alert>

    <b-table
       show-empty
       :items="getItems"
       :fields="fields"
    >
      <template slot="selected" slot-scope="row">
        <input type="checkbox" class="selected" v-model="selected" :value="row.item.id" />
      </template>
    </b-table>

    <b-button id="deleteLibraries" @click="handleLibraryDelete" :disabled="this.selected.length === 0" class="float-right">Delete Libraries</b-button>
  </div>
</template>

<script>
import handlePromise from '@/api/PromiseHelper'
import Api from '@/mixins/Api'
import Alert from '@/components/Alert'

export default {
  name: 'Libraries',
  mixins: [Api],
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
    Alert
  },
  methods: {
    async handleLibraryDelete () {
      try {
        await this.deleteLibraries()
      } catch (err) {
        this.message = err
        this.showAlert()
      }
    },
    async deleteLibraries () {
      let promises = this.libraryRequest.destroy(this.selected)
      let responses = await Promise.all(promises.map(promise => handlePromise(promise)))

      if (responses.every(r => r.successful)) {
        this.message = `Libraries ${this.selected.join(',')} successfully deleted`
        this.showAlert()
      } else {
        throw responses.map(r => r.errors.message)
      }
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  },
  computed: {
    libraryRequest () {
      return this.api.traction.libraries
    },
    getItems () {
      return this.items.map(i => Object.assign(i.material, {barcode: i.barcode}))
    }
  }
}

</script>
