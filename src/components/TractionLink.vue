<template>
  <router-link :to="link" :class="cssClass">
    {{ name }}
  </router-link>
</template>

<script>
export const ViewType = {
  Button: 1, //Display as dashboard button
  MenuItem: 2, // Display as menu item
}

export default {
  name: 'TractionLink',
  props: {
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    viewType: {
      type: [Number, String],
      default: () => ViewType.Button,
    },
  },
  computed: {
    cssClass() {
      return {
        'flex w-32 h-20 whitespace-normal justify-center items-center rounded-md border border-transparent text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 text-black bg-gray-300 hover:bg-gray-100 shadow-sm focus:border-gray-100 focus:shadow-outline-gray active:bg-gray-100':
          this.viewType == ViewType.Button,
        'group items-center px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:text-white text-gray-400 hover:text-white':
          this.viewType == ViewType.MenuItem,
      }
    },
  },
}
</script>
