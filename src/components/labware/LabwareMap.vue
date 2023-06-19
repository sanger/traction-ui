<template>
  <div class="flex w-full">
    <div class="border border-sdb py-2 bg-blue-100 rounded-lg px-2 w-full">
      <div v-for="(row, i) in numRows" :key="i" class="flex flex-row">
        <div v-for="(column, j) in numColumns" :key="j" class="px-1 py-1 w-full h-full">
          <slot :position="createPosition(row, column)" :interactive="interactive" />
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
  Usage:
  <LabwareMap 
    v-slot="{ position, interactive }"
    name="96-well plate"
    :num-rows=6
    :num-columns=5
    :interactive=true
  >
    <PacbioRunWell :position="position" :interactive="interactive"/>
  </LabwareMap>  
*/
}
export default {
  name: 'LabwareMap',
  props: {
    // Name to use at the bottom of the labware
    name: {
      type: String,
      default: '',
    },
    // Number of rows on the labware
    numRows: {
      type: Number,
      required: true,
      default: 0,
    },
    // Number of columns on the labware
    numColumns: {
      type: Number,
      required: true,
      default: 0,
    },
    // Determines whether the labware is interactable
    interactive: {
      type: Boolean,
      default: true,
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
