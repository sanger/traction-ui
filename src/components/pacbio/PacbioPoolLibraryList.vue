<template>
  <div v-if="requests" data-type="pool-library-list">
    <PacbioPoolLibraryEdit
      v-for="request in requests"
      :key="request.id"
      :request="request"
    ></PacbioPoolLibraryEdit>
  </div>
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
