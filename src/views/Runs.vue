<template>
    <div class="runs">
      <alert ref='alert'></alert>

      <b-button id="newRun" class="float-right" @click="createNewRun">Create New Run</b-button>

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

        <template slot="actions" slot-scope="row">
          <b-button size="sm" @click="editRun(row.item)" class="mr-1">
            Edit Run
          </b-button>
        </template>

      </b-table>

    </div>
</template>

<script>
import Alert from '@/components/Alert'
import ComponentFactory from '@/mixins/ComponentFactory'
import Api from '@/api'

export default {
  name: 'Runs',
  mixins: [ComponentFactory],
  props: {
  },
  data () {
    return {
      fields: [
        { key: 'id', label: 'Run ID', sortable: true },
        { key: 'state', label: 'State', sortable: true },
        { key: 'chip_barcode', label: 'Chips Barcode', sortable: true },
        { key: 'created_at', label: 'Created at', sortable: true },
        { key: 'actions', label: 'Actions' },
      ],
      items: [],
      filter: null
    }
  },
  methods: {
    editRun(item) {
      let runId = item.id
      this.$router.push({name: 'NewRun', params: {runId: parseInt(runId)}})
    },
    async getRuns () {
      let rawResponse = await this.runRequest.get()
      let response = new Api.Response(rawResponse)

      if (Object.keys(response.errors).length === 0) {
        let runs = response.deserialize.runs
        this.items = runs
      } else {
        this.message = response.errors.message
        this.showAlert
        this.items = []
      }
    },
    async createNewRun () {
      let body = { data: { type: 'runs', attributes: { runs: [{ state: 'pending'}] }}}

      let rawResponse = await this.runRequest.create(body)
      let response = new Api.Response(rawResponse)

      let runId
      if (Object.keys(response.errors).length === 0) {
        runId = response.deserialize.runs[0].id
        this.$router.push({name: 'NewRun', params: {runId: parseInt(runId)}})
      } else {
        this.message = response.errors.message
        this.showAlert
      }
    },
    provider() {
      this.getRuns()
    }
  },
  created() {
    this.provider()
  },
  components: {
    Alert
  },
  computed: {
    runRequest () {
      return this.build(Api.Request, this.tractionConfig.resource('runs'))
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
