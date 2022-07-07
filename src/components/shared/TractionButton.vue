<template>
  <button
    :class="[
      'w-full inline-flex justify-center rounded-md border border-transparent',
      'px-4 py-2 text-base font-medium',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'sm:mt-0 sm:w-auto sm:text-sm disabled:cursor-not-allowed disabled:opacity-50',
      colour,
    ]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'TractionButton',
  props: {
    theme: {
      type: String,
      default: 'default',
      required: false,
    },
  },
  computed: {
    colour: ({ theme }) => ({
      'text-white bg-sdb-400 hover:bg-sdb active:bg-sdb-600': theme === 'default',
      'text-white bg-green-500 hover:bg-green-400 active:bg-green-600': theme === 'create',
    }),
  },
}
</script>
