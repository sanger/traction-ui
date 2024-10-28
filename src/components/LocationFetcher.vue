<template>
  <div></div>
</template>

<script>
import { getLabwhereLocations } from '@/services/labwhere/client.js'
import { formatLocations } from '@/services/labwhere/helpers.js'

export default {
  name: 'LocationFetcher',
  props: {
    barcodes: {
      type: Array,
      required: true,
    },
  },
  emits: ['locationData'],
  watch: {
    barcodes: {
      immediate: true,
      handler() {
        this.fetchLocations()
      },
    },
  },
  methods: {
    async fetchLocations() {
      if (this.barcodes.length === 0) {
        this.$emit('locationData', this.defaultLocations())
        return
      }

      try {
        const locationData = await getLabwhereLocations(this.barcodes)
        const formattedLocations = await formatLocations(locationData)

        this.$emit('locationData', formattedLocations)
      } catch (error) {
        console.error('Error fetching locations:', error)
        this.$emit('locationData', this.defaultLocations()) // Emit default locations on error
      }
    },
    defaultLocations() {
      return this.barcodes.map((barcode) => ({
        barcode,
        name: '-', // Default name for missing barcodes
      }))
    },
  },
}
</script>
