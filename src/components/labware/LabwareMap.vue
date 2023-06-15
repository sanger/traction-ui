<template>
  <div class="flex w-full">
    <div
      class="border border-sdb py-2 bg-blue-100 rounded-lg px-2 w-full"
    >
      <div 
        v-for="(row, i) in props.numRows" :key="i"
        class="flex flex-row"
      >
        <div 
          v-for="(column, j) in props.numColumns" :key="j"
          class="px-1 py-1 w-full h-full"
        >
          <slot
            :position="createPosition(row, column)" 
            :interactive="props.interactive"
          >
            <!-- Fallback well component if none is passed in -->
            <LabwareWell 
              :position="createPosition(row, column)" 
              :interactive="props.interactive" 
            />
          </slot>
        </div>
      </div>
      <span class="flex py-1 px-2 font-medium text-gray-500">{{ props.name }}</span>
    </div>
  </div>
</template>
<script setup>
import LabwareWell from './LabwareWell.vue'
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  numRows: {
    type: Number,
    required: true,
    default: 0,
  },
  numColumns: {
    type: Number,
    required: true,
    default: 0,
  },
  interactive: {
    type: Boolean,
    default: true,
  },
})

function createPosition(rowNumber, columnNumber) {
  if (rowNumber > 26) {
    return `${rowNumber},${columnNumber}`;
  }
  const aCharCode = 'A'.charCodeAt(0);
  const row = String.fromCharCode(rowNumber + aCharCode - 1);
  return `${row}${columnNumber}`;
}
</script>
