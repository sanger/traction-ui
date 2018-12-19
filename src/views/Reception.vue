<template>
  <div class="reception">
    <table class="table">
      <data-list resource="requests"></data-list>
    </table>
  </div>
</template>

<script>

import DataList from '@/api/DataList'

export default {
  name: 'Reception',

  data () {
    return {
    }
  },
  created() {
  },
  methods: {
  },
  components: {
    DataList
  },
  computed: {
  }
}
</script>

<style lang="scss">
</style>
