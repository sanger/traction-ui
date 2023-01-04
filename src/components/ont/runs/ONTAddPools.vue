<template>
  <div>
    <traction-section title="Add Pools" number="2" class="mb-2">
      <LabwareFinder :fetcher="findOntPool" filter="barcode" class="mb-6" />
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
const { mapActions } = createNamespacedHelpers('traction/ont/pools')

export default {
  name: 'ONTAddPools',
  components: {
    LabwareFinder,
  },
  data() {
    return {
      pool_barcode: null,
    }
  },
  computed: {},
  methods: {
    search() {
      console.log('Searching... with ', this.pool_barcode)
    },
    ...mapActions(['findOntPool']),
  },
}
</script>
