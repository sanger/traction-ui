<template>
  <b-col>
    <b-form @submit.prevent="handleSubmit()">
      <h3>Find plates</h3>
      <Alert ref="alert"></Alert>
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
import Helper from '@/mixins/Helper'
import Alert from '@/components/Alert'
import { createNamespacedHelpers } from 'vuex'
const { mapMutations, mapActions } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PacbioLabwareFind',
  components: {
    Alert,
  },
  mixins: [Helper],
  data() {
    return {
      enteredLabware: '',
    }
  },
  computed: {
    getFilteredList() {
      return this.labwareList.filter((labware) => labware.barcode.includes(this.enteredLabware))
    },
    labwareList() {
      return this.$store.getters['traction/pacbio/poolCreate/labwareList']
    },
  },
  methods: {
    handleSubmit() {
      let labware = this.labwareList.find((labware) => labware.barcode === this.enteredLabware)
      labware
        ? this.toggleSelected(labware)
        : this.showAlert(
            'Unable to find a plate with the barcode: ' + this.enteredLabware,
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
  overflow: scroll;
}

.list-group-item {
  margin: 0;
}
</style>
