<template>
  <b-col v-if="requests" data-type="pool-library-list" class="border">
    <h3>Pooled Samples</h3>
    <PacbioPoolLibraryEdit
      v-for="request in requests"
      :key="request.id"
      :request="request"
    ></PacbioPoolLibraryEdit>
  </b-col>
</template>

<script>
import PacbioPoolLibraryEdit from '@/components/pacbio/PacbioPoolLibraryEdit'

export default {
  name: 'PacbioPoolLibraryList',
  components: {
    PacbioPoolLibraryEdit,
  },
  data() {
    return {}
  },
  computed: {
    requests() {
      return this.$store.getters['traction/pacbio/poolCreate/selectedRequests']
    },
  },
}
</script>

<style scoped lang="scss">
h3 {
  text-align: left;
  border-bottom: 1px solid;
  padding: 5px;
}
</style>
