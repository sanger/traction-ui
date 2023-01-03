<template>
  <!--Card 1-->
  <div class="rounded overflow-hidden shadow-lg bg-green-500">
    <div class="px-6 py-4">
      <div class="font-bold text-l mb-2">{{ poolBarcode }}</div>
      <p class="text-gray-700 text-base">Flowcell {{ flowcellRow }}, {{ flowcellCol }}</p>
    </div>
    <div class="px-4 py-2 bg-white">ID: {{ flowcellId }}</div>
  </div>
</template>
<script>
/**
 * # ONTFlowCell
 *
 * Displays a panel for an individual flow cell. May be empty or contain a pool.
 */
export default {
  name: 'ONTFlowCell',
  props: {
    flowcellId: {
      type: String,
      required: true,
    },
    flowcellRow: {
      type: Number,
      required: true,
    },
    flowcellCol: {
      type: Number,
      required: true,
    },
    poolBarcode: {
      type: String,
      required: false,
      default: 'No pool set',
    },
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
  },
}
</script>
