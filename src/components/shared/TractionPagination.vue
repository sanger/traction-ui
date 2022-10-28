<template>
  <t-pagination
    :value="currentPage"
    :total-items="totalItems"
    :per-page="itemsPerPage"
    :limit="numPaginationButtons"
    :disabled="disabled"
    @change="change($event)"
  />
</template>

<script>
import Vue from 'vue'
import VueTailwind from 'vue-tailwind'
import TPagination from 'vue-tailwind/dist/t-pagination'

const settings = {
  't-pagination': {
    component: TPagination,
    props: {
      classes: {
        wrapper: 'bg-white mx-auto text-center flex flex-row space-x-2',
        element: 'w-8 h-8 ',
        activeElement: 'w-8 h-8',
        disabledElement: 'w-8 h-8 ',
        ellipsisElement: 'w-8 h-8  hidden md:inline',
        activeButton:
          'border border-blue-500 bg-blue-500 w-full h-full  text-white hover:bg-blue-600 transition duration-100 ease-in-out focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
        disabledButton:
          'border border-gray-200  opacity-25 w-full h-full  cursor-not-allowed transition duration-100 ease-in-out',
        button:
          'border border-gray-200 hover:bg-blue-100 hover:border-blue-100  w-full h-full transition duration-100 ease-in-out focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
        ellipsis: '',
      },
    },
  },
}
Vue.use(VueTailwind, settings)

export default {
  name: 'TractionPagination',
  components: {
    TPagination,
  },
  props: {
    //value field  which will be bind automatically with 'v-model' prop passed into the component
    value: {
      type: Number,
      default: 0,
    },
    /**How many total items are in the list */
    totalItems: {
      type: Number,
      default: 0,
    },
    /**Number of items that every page represents */
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    /**How many buttons (including the ellipsis if shown) should be rendered */
    numPaginationButtons: {
      type: Number,
      default: 5,
    },
    /**Disabled or not */
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentPage: this.value,
    }
  },
  methods: {
    /**Emitted when the page change */
    change(pageNumber) {
      this.$emit('change', pageNumber)
    },
  },
}
</script>
