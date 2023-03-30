<template>
  <div class="mt-8">
    <traction-section number="2b" title="Selected Tubes">
      <traction-list-group class="selected-list-group">
        <traction-table
          :items="selectedTubeRequests"
          show-empty
          small
          :fields="requestFields"
          :tbody-tr-class="rowClass"
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
      </traction-list-group>
    </traction-section>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

// TODO: Does this need to be moved to top level ONT?
const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers('traction/ont/pools')

/**
 * # OntTubeSelectedList
 *
 * Displays a list of tube requests that are in the ont selected store
 */
export default {
  name: 'OntTubeSelectedList',
  data() {
    return {
      requestFields: [
        { key: 'id', label: 'id' },
        { key: 'sample_name', label: 'Sample name' },
        { key: 'source_identifier', label: 'Source identifier' },
        { key: 'data_type', label: 'Data type' },
        { key: 'library_type', label: 'Library type' },
        { key: 'number_of_flowcells', label: 'Number of flowcells' },
        { key: 'action', label: 'Action' },
      ],
    }
  },
  computed: {
    ...mapGetters(['selectedTubes', 'requestList']),
    selectedTubeRequests() {
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
