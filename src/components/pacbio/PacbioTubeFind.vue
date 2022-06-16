<template>
  <b-col>
    <b-form @submit.prevent="handleSubmit()">
      <h3>Find Tube</h3>
      <b-form-input
        v-model="enteredLabware"
        data-input="tube-find"
        autocomplete="off"
        placeholder="Search or scan for tube by barcode"
        class="mb-2"
      >
      </b-form-input>
      <b-list-group data-type="tube-list" class="find-list-group">
        <b-list-group-item
          v-for="item in getFilteredList"
          :key="item.id"
          button
          :active="item.selected"
          data-action="select-tube"
          @click="toggleSelected(item)"
        >
          Tube: {{ item.barcode }}
        </b-list-group-item>
      </b-list-group>
    </b-form>
  </b-col>
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
      let labware = this.tubeList.find((labware) => labware.barcode === this.enteredLabware)
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
