<template>
    <div class="runs">
      <alert ref='alert'></alert>

      <b-button id="newRun" class="float-right" @click="showRun()" variant="success">Create New Run</b-button>

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
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
      >

        <template slot="actions" slot-scope="row">
          <b-button size="sm" @click="showRun(row.item.id)" class="mr-1">
            Edit Run
          </b-button>

          <b-button id="completeRun" size="sm" class="mr-1" @click="completeRun(row.item.id)" :disabled="isRunDisabled(row.item)">
            Complete Run
          </b-button>

          <b-button id="cancelRun" size="sm" class="mr-1" @click="cancelRun(row.item.id)" :disabled="isRunDisabled(row.item)">
            Cancel Run
          </b-button>
        </template>
      </b-table>

    </div>
</template>

<script>
import Alert from '@/components/Alert'
import Api from '@/mixins/Api'
import RunMixin from '@/mixins/RunMixin'

export default {
  name: 'Runs',
  mixins: [Api, RunMixin],
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
      filter: null,
      sortBy: 'created_at',
      sortDesc: true
    }
  },
  methods: {
    async provider() {
      this.items = await this.getRuns()
    },
    isRunDisabled(run) {
      return run.state == 'completed' || run.state == 'cancelled'
    }
  },
  created() {
    this.provider()
  },
  components: {
    Alert
  },
  computed: {
    // showAlert () {
    //   return this.$refs.alert.show(this.message, 'primary')
    // }
  }
}
</script>
