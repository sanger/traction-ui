<template>
  <div>
    <traction-section number="2" title="Add Pools">
      <div class="flex flex-row">
        <traction-input
          v-model="pool_barcode"
          data-attribute="pool-barcode"
          placeholder="Enter a pool barcode"
        />
        <traction-button data-action="find-pools" @click="search()"> Search </traction-button>
      </div>
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
export default {
  name: 'ONTAddPools',
  data() {
    return {
      pool_barcode: null
    }
  },
  computed: {},
  methods: {
    search() {
      console.log("Searching... with ", this.pool_barcode)
    }
  },
}
</script>
