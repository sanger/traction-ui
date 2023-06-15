<template>
    <div 
        :class="wellClassNames"
        @mouseover="hover = true"
        @mouseleave="hover = false"
    >
        <p class="truncate font-light">{{props.position}}</p>
    </div>
</template>
<script setup>
import {computed, ref} from 'vue'

const props = defineProps({
  position: {
    type: String,
    required: true,
  },
  interactive: {
    type: Boolean,
    default: true,
  },
})

const hover = ref(false)

const wellClassNames = computed(() => {
    return [
        hover.value && props.interactive ? 'ring ring-pink-600 ring-offset-1' : 'border border-gray-800',
        props.interactive ? 'cursor-pointer' : '',
        "flex flex-col justify-center mx-auto rounded-full text-xs bg-gray-100 font-semibold aspect-square w-full select-none"
    ]
})
</script>