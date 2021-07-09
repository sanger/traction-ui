<template>
  <b-col v-if="requests" data-type="pool-library-list">
    <h3>Pooled Samples</h3>
    <div class="wrapper">
      <div>Sample Name</div>
      <div>Source</div>
      <div>Tag</div>
      <div>Template prep kit box barcode</div>
      <div>Volume</div>
      <div>Concentration</div>
      <div>Fragment Size</div>
    </div>
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
@import 'src/styles/components.scss';
.wrapper {
  display: flex;
  justify-content: space-evenly;
  padding: 5px;
  border-bottom: 1px dashed;
}
.wrapper > div {
  font-size: 0.9em;
}
</style>
