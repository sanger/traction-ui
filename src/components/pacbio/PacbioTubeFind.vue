<template>
  <div>
    <traction-form @submit.prevent="handleSubmit()">
      <traction-section number="2a" title="Tube" class-names="mb-2">
        <div class="text-left">Find Tube</div>
        <traction-input
          v-model="enteredLabware"
          data-input="tube-find"
          placeholder="Search or scan for tube by barcode"
          classes="mb-2"
        >
        </traction-input>
        <traction-list-group data-type="tube-list" class="find-list-group">
          <traction-list-group-item
            v-for="item in getFilteredList"
            :key="item.id"
            button
            :active="item.selected"
            data-action="select-tube"
            @click="toggleSelected(item)"
          >
            Tube: {{ item.barcode }}
          </traction-list-group-item>
        </traction-list-group>
      </traction-section>
    </traction-form>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PacbioLabwareFind',
  data() {
    return {
      enteredLabware: '',
    }
  },
  computed: {
    getFilteredList() {
      return this.tubeList.filter((labware) => labware.barcode.includes(this.enteredLabware))
    },
    ...mapGetters(['tubeList']),
  },
  methods: {
    handleSubmit() {
      const labware = this.tubeList.find((labware) => labware.barcode === this.enteredLabware)
      labware
        ? this.toggleSelected(labware)
        : this.showAlert(
            `Unable to find labware with the barcode: ${this.enteredLabware}`,
            'danger',
          )
      this.enteredLabware = ''
    },
    toggleSelected({ id, selected }) {
      if (selected) {
        this.deselectTubeAndContents(id)
      } else {
        this.selectTubeAndContents(id)
      }
    },
    ...mapActions(['deselectTubeAndContents', 'selectTubeAndContents']),
  },
}
</script>

<style scoped lang="scss">
@import 'src/styles/components.scss';
.find-list-group {
  max-height: 150px;
  overflow-y: auto;
}

.list-group-item {
  margin: 0;
}
</style>
