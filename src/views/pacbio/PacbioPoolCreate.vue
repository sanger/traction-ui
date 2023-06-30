<template>
  <div id="pool">
    <div class="flex flex-col pt-4">
      <div class="flex flex-col w-1/2 px-4">
        <traction-menu :border="true">
          <traction-menu-item
            v-for="(tabTitle, index) in tabTitles"
            :key="index"
            :active="index == sourceIndex"
            color="blue"
            @click.native="setSource(index)"
            >{{ tabTitle }}</traction-menu-item
          >
        </traction-menu>
      </div>
      <div class="w-full grid grid-cols-2 space-x-2 mt-4">
        <div v-if="sourceIndex == 0" class="flex flex-col">
          <traction-section title="Plates" number="1a">
            <div class="text-left">Find Plates</div>
            <LabwareFinder :fetcher="findPacbioPlate" filter="barcode" />
          </traction-section>
        </div>
        <div v-else>
          <traction-section title="Tubes" number="2a">
            <div class="text-left">Find Tubes</div>
            <LabwareFinder :fetcher="findPacbioTube" filter="barcode" />
          </traction-section>
        </div>
        <div>
          <PacbioTagSetList ref="tagSetList" />
          <PacbioTagSetItem />
        </div>
        <div v-if="sourceIndex == 0">
          <PacbioPlateSelectedList />
        </div>
        <div v-else><PacbioTubeSelectedList /></div>
        <div>
          <PacbioPoolEdit />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PacbioTagSetList from '@/components/pacbio/PacbioTagSetList'
import PacbioPlateSelectedList from '@/components/pacbio/PacbioPlateSelectedList'
import PacbioTubeSelectedList from '@/components/pacbio/PacbioTubeSelectedList'
import PacbioTagSetItem from '@/components/pacbio/PacbioTagSetItem'
import PacbioPoolEdit from '@/components/pacbio/PacbioPoolEdit'
import LabwareFinder from '@/components/LabwareFinder'

import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PacbioPoolCreate',
  components: {
    PacbioTagSetList,
    PacbioPlateSelectedList,
    PacbioTubeSelectedList,
    PacbioTagSetItem,
    PacbioPoolEdit,
    LabwareFinder,
  },

  data() {
    return { sourceIndex: 0, tabTitles: ['Add Plates', 'Add Tubes'] }
  },
  created() {
    const tagSets = this.fetchPacbioTagSets()
    // Needed due to left over pool data from previously edited pools
    this.$store.commit('traction/pacbio/poolCreate/clearPoolData')

    if (this.$route.params.id !== 'new') {
      const libraries = this.populateLibrariesFromPool(this.$route.params.id)
      libraries.then(this.alertOnFail)
    }
    // We don't use await here as otherwise the handling of one response will be blocked
    // by the other
    tagSets.then(this.alertOnFail)
  },
  methods: {
    alertOnFail({ success, errors }) {
      if (!success) {
        this.showAlert(errors, 'danger')
      }
    },
    setSource(indx) {
      this.sourceIndex = indx
    },
    ...mapActions([
      'fetchPacbioTagSets',
      'populateLibrariesFromPool',
      'findPacbioPlate',
      'findPacbioTube',
    ]),
  },
}
</script>

<style scoped></style>
