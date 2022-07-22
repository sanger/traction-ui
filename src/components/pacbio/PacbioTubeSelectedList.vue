<template>
  <div class="mt-8">
    <TractionSection title="Selected Tubes">
      <traction-list-group class="selected-list-group">
        <traction-table
          :items="selectedTubeRequests"
          show-empty
          small
          :fields="requestFields"
          :tbody-tr-class="rowClass"
          empty-text="No tubes selected"
          @row-clicked="requestClicked"
        ></traction-table>
      </traction-list-group>
    </TractionSection>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers(
  'traction/pacbio/poolCreate',
)

export default {
  name: 'PacbioLabwareSelectedList',
  data() {
    return {
      requestFields: [
        'source_identifier',
        'sample_species',
        'library_type',
        'number_of_smrt_cells',
        'estimate_of_gb_required',
      ],
    }
  },
  computed: {
    ...mapGetters(['selectedTubes', 'wellList', 'requestList']),
    selectedTubeRequests() {
      // Not really sure this belongs here, and I'd prefer to see this handled
      // in the getters.
      return this.selectedTubes.flatMap((tube) => {
        return this.requestList(tube.requests || [])
      })
    },
  },
  methods: {
    ...mapMutations(['selectTube', 'selectRequest']),
    ...mapActions(['selectWellRequests']),
    requestClicked({ id, selected }) {
      this.selectRequest({ id, selected: !selected })
    },
    rowClass(item) {
      if (item && item.selected) {
        return 'table-primary'
      }
    },
    onSelect(e) {
      e.added.forEach((el) => {
        this.selectWellRequests(el.__vue__.$attrs.id)
      })
      e.removed.forEach((el) => {
        this.selectWellRequests(el.__vue__.$attrs.id)
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import 'src/styles/components.scss';
.wrapper {
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
}
.wrapper > div {
  width: 50%;
}
</style>
