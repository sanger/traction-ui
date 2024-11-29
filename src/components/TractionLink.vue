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
        'flex w-32 h-20 p-2 justify-center items-center rounded-md border border-gray-200 text-sm font-sm hover:bg-gray-100 shadow-sm':
          this.viewType == ViewType.Button,
        'items-center px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:text-white text-gray-400 hover:text-white':
          this.viewType == ViewType.MenuItem,
        'text-white': this.isActive,  
      }
    },
    isActive() {
      return this.$route.path === this.link
    }
  },
}
</script>
