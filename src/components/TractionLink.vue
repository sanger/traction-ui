<template>
   <router-link
      class="px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:text-white focus:bg-gray-700 text-gray-100 hover:text-white hover:bg-gray-700"
      :to="`${link}`"
    >
      {{name}}
    </router-link>
</template>

<script>

export default {
  name: 'TractionLink',
  props: {
    name: {
      type: String,
      required: true,
    },
    link: {
        type:String,
        required:true
    }
  },
  data() {
    return {
      isActive: false,
    }
  },
}
</script>

