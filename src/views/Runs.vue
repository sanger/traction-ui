<template>
    <div class="runs">
      <alert ref='alert'></alert>

      <b-button id="newRun" class="float-right" @click="showRun()" variant="success">New Run</b-button>

      <b-col md="6" class="my-1">
        <b-input-group>
          <b-form-input v-model="filter" placeholder="Type to Filter" />
          <b-input-group-append>
            <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>

      <b-col>
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
        ></b-pagination>
      </b-col>

      <b-table
          show-empty
          :items="items"
          :fields="fields"
          :filter="filter"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :per-page="perPage"
          :current-page="currentPage"
      >

        <template slot="actions" slot-scope="row">
          <b-button :id="generateId('createRun',row.item.id)" variant="outline-dark" size="sm" @click="showRun(row.item.id)" class="mr-1">
            Edit
          </b-button>

          <b-button :id="generateId('startRun',row.item.id)" variant="outline-success" size="sm" class="mr-1" @click="startRun(row.item.id)" :disabled="row.item.state !== 'pending'">
            Start
          </b-button>

          <b-button :id="generateId('completeRun',row.item.id)" variant="outline-primary" size="sm" class="mr-1" @click="completeRun(row.item.id)" :disabled="isRunDisabled(row.item)">
            Complete
          </b-button>

          <b-button :id="generateId('cancelRun',row.item.id)" variant="outline-danger" size="sm" class="mr-1" @click="cancelRun(row.item.id)" :disabled="isRunDisabled(row.item)">
            Cancel
          </b-button>
        </template>
      </b-table>

    </div>
</template>

<script>
import Alert from '@/components/Alert'
import RunMixin from '@/mixins/RunMixin'
export default {
  name: 'Runs',
  mixins: [RunMixin],
  props: {
  },
  data () {
    return {
      fields: [
        { key: 'id', label: 'Run ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'state', label: 'State', sortable: true },
        { key: 'chip_barcode', label: 'Chips Barcode', sortable: true },
        { key: 'created_at', label: 'Created at', sortable: true },
        { key: 'actions', label: 'Actions' },
      ],
      items: [],
      filter: null,
      sortBy: 'created_at',
      sortDesc: true,
      perPage: 10,
      currentPage: 1,
    }
  },
  methods: {
    async provider() {
      this.items = await this.getRuns()
    },
    isRunDisabled(run) {
      return run.state == 'completed' || run.state == 'cancelled'
    },
    isRunPending(run) {
      return run.state !== 'pending'
    },
    generateId(text, id) {
      return `${text}-${id}`
    }
  },
  created() {
    this.provider()
  },
  components: {
    Alert
  },
  computed: {
  }
}
</script>
