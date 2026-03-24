<template>
  <div>
    <router-link
      :to="{
        name: 'FlexibleIndividualPoolCreate',
        params: { id, position },
      }"
      data-attribute="flexible-pool-well-link"
      class="block"
    >
      <div
        :class="wellClassNames"
        data-attribute="flexible-pool-well"
        @mouseover.prevent="hover = true"
        @mouseleave.prevent="hover = false"
        @click="onClick"
      >
        <p class="wrap-anywhere whitespace-normal p-1 relative">{{ pool?.pool_barcode }}</p>
        <TractionTickIcon
          v-if="pool && isValidPool"
          class="absolute w-full h-full opacity-25 z-0 pointer-events-none"
        />
        <TractionCrossIcon
          v-else-if="pool && !isValidPool"
          class="absolute w-full h-full opacity-25 z-0 pointer-events-none"
        />
      </div>
      <p data-attribute="well-position" class="truncate font-light text-xs">{{ position }}</p>
    </router-link>
  </div>
</template>
<script setup>
/**
 * @name FlexiblePoolWell
 * @description A single well/pool in the flexible pooling page
 */
import TractionTickIcon from '@/components/shared/icons/TractionTickIcon.vue'
import TractionCrossIcon from '@/components/shared/icons/TractionCrossIcon.vue'
import { useMultiPoolCreateStore } from '@/stores/multiPoolCreate.js'
import { ref, computed } from 'vue'

/**
 * Props for the component.
 * @type {Object}
 * @property {string} position - The position of the well. This prop is required.
 */
const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
})

/*
 * Define the emits for the component.
 * The component emits a 'click' event when the well is clicked.
 */
const emit = defineEmits(['click'])

/*
 * Create a store instance of the multiPoolCreateStore.
 */
const multiPoolCreateStore = useMultiPoolCreateStore()

/*
 * Define refs for the component.
 * The `hover` ref is used to determine if the well is being hovered over.
 */
const hover = ref(false)

/*
 * Computed property that returns the class names for the well.
 * @returns {Array} - An array of class names for the well.
 */
const wellClassNames = computed(() => {
  return [
    poolStatus.value,
    hover.value ? 'ring ring-pink-600 ring-offset-1' : 'border border-gray-800',
    'flex flex-col justify-center mx-auto rounded-full text-xs font-semibold aspect-square select-none transition duration-200 ease-out cursor-pointer relative',
  ]
})

/*
 * Computed property that returns the pool from the store.
 * @returns {Object} - The pool from the store.
 */
const pool = computed(() => {
  return multiPoolCreateStore.getPool(props.position)
})

/*
 * Computed property that returns whether the pool is valid
 * @returns {boolean} - Whether the pool is valid
 */
const isValidPool = computed(() => {
  return multiPoolCreateStore.isValidPool(props.position)
})

/*
 * Computed property that returns the status of the pool regarding CSS styles
 * @returns {boolean} - Whether the pool is valid
 */
const poolStatus = computed(() => {
  // Position is empty, so we consider it valid (no pool assigned to that position)
  if (!pool.value) {
    return 'bg-white text-black'
  } else if (isValidPool.value) {
    return 'bg-success text-white'
  } else {
    return 'bg-failure text-white'
  }
})

/*
 * Method that is called when the well is clicked.
 * Emits a 'click' event with the position of the well.
 */
const onClick = () => {
  emit('click', props.position)
}
</script>
