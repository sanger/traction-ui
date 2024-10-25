<template>
  <div></div>
</template>

<script>
import { getLabwhereLocations } from '@/services/labwhere/client.js'
import { getCoordinateForLabware } from '@/services/labwhere/helpers.js'

export default {
  name: 'LocationFetcher', // Declare the emitted event
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
        const locationsData = await getLabwhereLocations(this.barcodes)
        const extractedLocations = Object.entries(locationsData.data).map(([barcode, item]) => ({
          barcode,
          name: item.name || '-', // Default to '-' if no name
          coordinates: item.coordinates || null,
        }))

        const formattedLocations = await Promise.all(
          extractedLocations.map(async (location) => {
            const coordinates = await getCoordinateForLabware(location, location.barcode)
            return {
              ...location,
              coordinates,
            }
          }),
        )

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
