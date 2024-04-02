<template>
  <div class="mt-8">
    <traction-section number="2b" title="Selected Tubes">
      <traction-table
        :items="selectedTubeRequests"
        :fields="requestFields"
        empty-text="No tubes selected"
        @row-clicked="requestClicked"
      >
        <template #cell(action)="row">
          <traction-button
            :id="'remove-btn-' + row.item.id"
            size="sm"
            class="mr-2"
            theme="default"
            @click="deselectTubeAndContents(row.item.source_identifier)"
          >
            Remove
          </traction-button>
        </template>
      </traction-table>
    </traction-section>
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
        { key: 'source_identifier', label: 'Source identifier' },
        { key: 'sample_species', label: 'Sample species' },
        { key: 'library_type', label: 'Library type' },
        { key: 'number_of_smrt_cells', label: 'Number of smrt cells' },
        { key: 'estimate_of_gb_required', label: 'Estimate of gb required' },
        { key: 'action', label: 'Action' },
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
    ...mapActions(['selectWellRequests', 'deselectTubeAndContents']),
    requestClicked({ id, selected }) {
      this.selectRequest({ id, selected: !selected })
    },
    rowClass(item) {
      if (item && item.selected) {
        return 'bg-gray-400'
      }
    },
  },
}
</script>
