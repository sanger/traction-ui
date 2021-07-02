<template>
  <b-form @submit="handleSumbit()">
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
        @click="setSelected(item)"
      >
        Plate: {{ item.barcode }}
      </b-list-group-item>
    </b-list-group>
  </b-form>
</template>

<script>
import Helper from '@/mixins/Helper'
import { createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PacbioLabwareFind',
  mixins: [Helper],
  data() {
    return {
      enteredLabware: '',
    }
  },
  computed: {
    getFilteredList() {
      return this.labList.filter((labware) => labware.barcode.includes(this.enteredLabware))
    },
    labList() {
      return this.$store.getters['traction/pacbio/poolCreate/labwareList']
    },
  },
  methods: {
    handleSumbit() {
      let labware = this.labList.find((labware) => labware.barcode === this.enteredLabware)
      labware ? this.setSelected(labware) : console.log('Emits alert?')
      this.enteredLabware = ''
    },
    setSelected(labware) {
      this.selectPlate(labware)
    },
    ...mapMutations(['selectPlate']),
  },
}
</script>

<style>
.find-list-group {
  max-height: 150px;
  overflow: scroll;
}

.list-group-item {
  margin: 0;
}
</style>
