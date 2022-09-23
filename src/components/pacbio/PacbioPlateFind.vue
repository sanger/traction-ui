<template>
  <traction-form @submit.prevent="handleSubmit()">
    <traction-section title="Plate" number="1a" class="mb-2">
      <div class="text-left">Find Plate</div>
      <traction-input
        v-model="enteredLabware"
        data-input="plate-find"
        autocomplete="off"
        placeholder="Search or scan for plate by barcode"
        class-names="mb-2"
      >
      </traction-input>
      <traction-list-group data-type="plate-list" class="find-list-group">
        <traction-list-group-item
          v-for="item in getFilteredList"
          :key="item.id"
          button
          :active="item.selected"
          data-action="select-plate"
          @click="toggleSelected(item)"
        >
          Plate: {{ item.barcode }}
        </traction-list-group-item>
      </traction-list-group>
    </traction-section>
  </traction-form>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapMutations, mapActions, mapGetters } = createNamespacedHelpers(
  'traction/pacbio/poolCreate',
)

export default {
  name: 'PacbioLabwareFind',
  data() {
    return {
      enteredLabware: '',
    }
  },
  computed: {
    getFilteredList() {
      return this.plateList.filter((labware) => labware.barcode.includes(this.enteredLabware))
    },
    ...mapGetters(['plateList']),
  },
  methods: {
    handleSubmit() {
      let labware = this.plateList.find((labware) => labware.barcode === this.enteredLabware)
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
        this.deselectPlateAndContents(id)
      } else {
        this.selectPlate({ id })
      }
    },
    ...mapMutations(['selectPlate']),
    ...mapActions(['deselectPlateAndContents']),
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