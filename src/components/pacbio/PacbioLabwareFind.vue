<template>
  <b-col>
    <b-form @submit.prevent="handleSubmit()">
      <h3>Find Labware</h3>
      <b-form-input
        v-model="enteredLabware"
        data-input="labware-find"
        autocomplete="off"
        placeholder="Search or scan for labware by barcode"
      >
      </b-form-input>
      <b-list-group data-type="labware-list" class="find-list-group">
        <b-list-group-item
          v-for="item in getFilteredList"
          :key="item.id"
          button
          :active="item.selected"
          data-action="select-labware"
          @click="toggleSelected(item)"
        >
          Plate: {{ item.barcode }}
        </b-list-group-item>
      </b-list-group>
    </b-form>
  </b-col>
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
      return this.labwareList.filter((labware) => labware.barcode.includes(this.enteredLabware))
    },
    ...mapGetters(['labwareList']),
  },
  methods: {
    handleSubmit() {
      let labware = this.labwareList.find((labware) => labware.barcode === this.enteredLabware)
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
