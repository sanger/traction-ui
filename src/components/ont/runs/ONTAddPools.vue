<template>
  <div>
    <traction-section title="Add Pools" number="2" class="mb-2">
      <LabwareFinder :fetcher="populateOntPools" filter="barcode" class="mb-6" />
      <traction-table
        id="pool-index"
        show-empty
        responsive
        :items="pools"
        :fields="fields"
        hover
        tbody-tr-class="pool"
      >
      </traction-table>
    </traction-section>
  </div>
</template>

<script>
/**
 * # ONTAddPools
 *
 * Displays a panel that allows the user to search for a pool by its barcode, then displays pool summary
 * panels that can be dragged into the flow cells of the instrument displayed on the right of the screen.
 * (see ONTRunInstrumentFlowcells)
 */
import LabwareFinder from '@/components/LabwareFinder'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters, mapState } = createNamespacedHelpers('traction/ont')

export default {
  name: 'ONTAddPools',
  components: {
    LabwareFinder,
  },
  data() {
    return {
      pool_barcode: null,
      fields: [
        { key: 'id', label: 'Pool ID', sortable: true, tdClass: 'pool-id' },
        { key: 'barcode', label: 'Barcode', sortable: true, tdClass: 'barcode' },
      ],
    }
  },
  computed: {
    ...mapState({
      pools: (state) => state.pooling,
    }),
    ...mapGetters(['pools']),
  },
  methods: {
    ...mapActions(['populateOntPools']),
  },
}
</script>
