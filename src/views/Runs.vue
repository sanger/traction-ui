<template>
    <div>
      <alert ref='alert'></alert>

      <b-form-group label="Filter"
                  label-cols-sm="1"
                  label-align-sm="right"
                  label-for="filterInput"
                  class="mb-0">
        <b-input-group>
          <b-form-input v-model="filter"
                        type="search"
                        id="filterInput"
                        placeholder="Type to Search">
          </b-form-input>
          <b-input-group-append>
            <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
      <br>

      <b-table id="runs-table"
               hover
               show-empty
               :items="items"
               :fields="fields"
               :filter="filter"
               :sort-by.sync="sortBy"
               :sort-desc.sync="sortDesc"
               :per-page="perPage"
               :current-page="currentPage"
               @filtered="onFiltered">
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

      <span class="font-weight-bold">Total records: {{ rows }}</span>

      <div class="clearfix">
        <b-button id="newRun"
                  class="float-left"
                  @click="showRun()"
                  variant="success">
          New Run
        </b-button>
        <b-pagination class="float-right"
                      v-model="currentPage"
                      :total-rows="rows"
                      :per-page="perPage"
                      aria-controls="libraries-table">
        </b-pagination>
      </div>
    </div>
</template>

<script>
import Alert from '@/components/Alert'
import RunMixin from '@/mixins/RunMixin'
import Helper from '@/mixins/Helper'

export default {
  name: 'Runs',
  mixins: [RunMixin, Helper],
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
      filteredItems: [],
      filter: null,
      sortBy: 'created_at',
      sortDesc: true,
      perPage: 5,
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
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.filteredItems = filteredItems
      this.currentPage = 1
    },
  },
  created() {
    this.provider()
  },
  components: {
    Alert
  },
  computed: {
    /**
     * We need the pagination component to reflect the correct number of rows dependent on the
     * items after filtering has been applied
     */
    rows() {
      if (this.filteredItems.length > 0) {
        return this.filteredItems.length
      }

      if (this.filteredItems.length == 0 && this.filter !== '' && this.filter !== null) {
        return this.filteredItems.length
      }

      return this.items.length
    }
  }
}
</script>
