<template>
    <div class="runs">
      <b-button id="newRun" class="float-right" @click="createNewRun">Create New Run</b-button>

      <b-table
         show-empty
         :items="getRuns"
         :fields="fields"
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
        { key: 'id', label: 'Run ID' },
        { key: 'state', label: 'State' },
        { key: 'chip_barcode', label: 'Chips Barcode' },
        { key: 'actions', label: 'Actions' }
      ],
    }
  },
  created: function () {
  },
  methods: {
    editRun(item) {
      let runId = item.id
      this.$router.push({name: 'NewRun', params: {runId: parseInt(runId)}})
    },
    async getRuns () {
      try {
        let rawRuns = await this.runRequest.get()
        return new Api.Response(rawRuns).deserialize.runs
      } catch(error) {
        return error
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
        throw this.message
      }

    }
  },
  components: {

  },
  computed: {
    runRequest () {
      return this.build(Api.Request, this.tractionConfig.resource('runs'))
    },
    tractionConfig () {
      return this.build(Api.ConfigItem, Api.Config.traction)
    },
  }
}
</script>
