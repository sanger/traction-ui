<template>
  <div :class="getClass()" @click="$router.push(`${link}`)">
    <router-link :to="`${link}`">
      {{ name }}
    </router-link>
  </div>
</template>

<script>
export const ViewType = {
  Button: 1, //Display as dashborad button
  MenuItem: 2, // Display as menu item
}

export default {
  name: 'Link',
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
      type: ViewType,
      default: ViewType.Button,
    },
  },
  methods: {
    getClass() {
      return {
        'flex w-32 h-24 whitespace-normal justify-center items-center rounded-md border border-transparent text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 text-white bg-sp hover:bg-sp-600 shadow-sm focus:border-sp-700 focus:shadow-outline-sp active:bg-sp-700':
          this.viewType == ViewType.Button,
        'px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:text-white focus:bg-gray-700 text-gray-100 hover:text-white hover:bg-gray-700':
          this.viewType == ViewType.MenuItem,
      }
    },
  },
}
</script>
