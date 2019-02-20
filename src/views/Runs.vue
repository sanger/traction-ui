<template>
    <div class="runs">
      <router-link :to="{name: 'NewRun'}">
        <b-button id="newRun" class="float-right">Create New Run</b-button>
      </router-link>

      <b-table
         show-empty
         :items="getRuns"
         :fields="fields"
      >
        <template slot="selected" slot-scope="row">
          <b-checkbox @change="toggleSelectedRow(row.item)"></b-checkbox>
        </template>
      </b-table>
      {{ selected }}
    </div>
</template>

<script>
import ApiConfig from '@/api/Config'
import ConfigItem from '@/api/ConfigItem'
import ComponentFactory from '@/mixins/ComponentFactory'
import Request from '@/mixins/Request'
import Response from '@/api/Response'

export default {
  name: 'Runs',
  mixins: [ComponentFactory],
  props: {
  },
  data () {
    return {
      fields: [
        { key: 'selected', label: '' },
        { key: 'id', label: 'Run ID' },
        { key: 'state', label: 'State' },
        { key: 'chip-barcode', label: 'Chips Barcode' }
      ],
      selected: []
    }
  },
  created: function () {
  },
  methods: {
    toggleSelectedRow(item) {
      if (this.selected.indexOf(item) === -1) {
        this.selected.push(item)
      } else {
        this.selected.splice(this.selected.indexOf(item), 1 );
      }
    },
    async getRuns () {
      try {
        let rawRuns = await this.runRequest.get()
        return new Response(rawRuns).deserialize.runs
      } catch(error) {
        return error
      }
    },
  },
  components: {

  },
  computed: {
    runRequest () {
      return this.build(Request, this.tractionConfig.resource('runs'))
    },
    tractionConfig () {
      return this.build(ConfigItem, ApiConfig.traction)
    },
  }
}
</script>
