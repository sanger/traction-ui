<template>
  <div class="flex w-full">
    <div class="border border-sdb py-2 bg-blue-100 rounded-lg px-2 w-full">
      <div v-for="(row, i) in labwareType.numRows" :key="i" class="flex flex-row">
        <div v-for="(column, j) in labwareType.numColumns" :key="j" class="px-1 py-1 w-full h-full">
          <slot :position="createPosition(row, column)" />
        </div>
      </div>
      <span data-attribute="labware-name" class="flex py-1 px-2 font-medium text-gray-500"
        >{{ name }}
      </span>
    </div>
  </div>
</template>

<script>
{
  /*
  A component to build labware maps.
  To add a new labwareType, add the config to src/lib/LabwareTypes'
  Usage:
  <LabwareMap 
    v-slot="{ position }"
    :labware-type="LabwareTypes.Plate96"
  >
    <PacbioRunWell :position="position"/>
  </LabwareMap>  
*/
}
import { LabwareTypes } from '../../lib/LabwareTypes'
export default {
  name: 'LabwareMap',
  props: {
    // Name to use at the bottom of the labware
    name: {
      type: String,
      default: '',
    },
    // Labware Type determines the name, number of rows and columns
    labwareType: {
      type: Object,
      default: LabwareTypes.Plate96,
    },
  },
  methods: {
    createPosition(rowNumber, columnNumber) {
      if (rowNumber > 26) {
        return `${rowNumber},${columnNumber}`
      }
      const aCharCode = 'A'.charCodeAt(0)
      const row = String.fromCharCode(rowNumber + aCharCode - 1)
      return `${row}${columnNumber}`
    },
  },
}
</script>
