<template>
  <b-form @submit="handleSumbit()">
    <b-form-input
      v-model="enteredLabware"
      autocomplete="off"
      placeholder="Search or scan for labware by barcode"
    >
    </b-form-input>
    <b-list-group class="find-list-group">
      <b-list-group-item
        v-for="item in getFilteredList"
        :key="item.id"
        button
        @click="setSelected(item)"
      >
        Plate: {{ item.attributes.barcode }}
      </b-list-group-item>
    </b-list-group>
  </b-form>
</template>

<script>
import Helper from '@/mixins/Helper'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions, mapMutations } = createNamespacedHelpers(
  'traction/pacbio/poolCreate',
)

export default {
  name: 'PacbioLabwareFind',
  mixins: [Helper],
  data() {
    return {
      enteredLabware: '',
    }
  },
  computed: {
    ...mapGetters(['labwareList']),
    getFilteredList() {
      // Conditional needed to make sure list has been pulled back before filter
      return this.labwareList.length
        ? this.labwareList.filter((labware) =>
            labware.attributes.barcode.includes(this.enteredLabware),
          )
        : []
    },
  },
  async mounted() {
    try {
      await this.fetchPacbioPlates()
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    handleSumbit() {
      let labware = this.labwareList.find(
        (labware) => labware.attributes.barcode === this.enteredLabware,
      )
      if (labware) {
        this.setSelected(labware)
      } else {
        console.log('Emits alert?')
      }
      this.enteredLabware = ''
    },
    setSelected(labware) {
      this.selectPlate(labware)
      this.selectPlateRequests({ barcode: labware.attributes.barcode, selected: true })
    },
    ...mapActions(['fetchPacbioPlates']),
    ...mapMutations(['selectPlate', 'selectPlateRequests']),
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
