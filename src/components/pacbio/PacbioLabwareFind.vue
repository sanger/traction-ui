<template>
  <b-form class="labware-list" @submit="handleSumbit()">
    <h3>Find labware</h3>
    <b-form-input
      v-model="enteredLabware"
      autocomplete="off"
      placeholder="Search or scan for labware by barcode"
    >
    </b-form-input>
    <b-list-group>
      <b-list-group-item
        v-for="item in getFilteredList"
        :key="item.id"
        button
        @click="selectLabware(item)"
      >
        Plate: {{ item.barcode }}
      </b-list-group-item>
    </b-list-group>
  </b-form>
</template>

<script>
import Helper from '@/mixins/Helper'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('traction/pacbio/poolCreate')

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
        ? this.labwareList.filter((labware) => labware.barcode.includes(this.enteredLabware))
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
      let labware = this.labwareList.find((labware) => labware.barcode === this.enteredLabware)
      labware ? this.selectLabware(labware) : console.log('Emits alert?')
      this.enteredLabware = ''
    },
    selectLabware(labware) {
      //perfom action to add labware as selected
      console.log(labware)
    },
    ...mapActions(['fetchPacbioPlates']),
  },
}
</script>

<style>
.labware-list {
  max-width: 400px;
}

.list-group {
  max-height: 200px;
  overflow: scroll;
}

.list-group-item {
  margin: 0;
}
</style>
