<template>
  <data-fetcher :fetcher="fetchPoolsData">
    <div class="flex flex-col pt-4">
      <div class="flex flex-col w-1/2 px-4">
        <traction-menu :border="true">
          <traction-menu-item
            v-for="(tabTitle, index) in tabTitles"
            :key="index"
            :active="index == sourceIndex"
            color="blue"
            @click="setSource(index)"
            >{{ tabTitle }}</traction-menu-item
          >
        </traction-menu>
      </div>
      <div class="w-full grid grid-cols-2 gap-x-2 mt-4">
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
  </data-fetcher>
</template>

<script>
import PacbioTagSetList from '@/components/pacbio/V1/PacbioTagSetListV1.vue'
import PacbioPlateSelectedList from '@/components/pacbio/V1/PacbioPlateSelectedListV1.vue'
import PacbioTubeSelectedList from '@/components/pacbio/V1/PacbioTubeSelectedListV1.vue'
import PacbioTagSetItem from '@/components/pacbio/V1/PacbioTagSetItemV1.vue'
import PacbioPoolEdit from '@/components/pacbio/V1/PacbioPoolEditV1.vue'
import LabwareFinder from '@/components/LabwareFinder.vue'
import DataFetcher from '@/components/DataFetcher.vue'

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
    DataFetcher,
  },

  data() {
    return { sourceIndex: 0, tabTitles: ['Add Plates', 'Add Tubes'] }
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
    async fetchPoolsData() {
      this.$store.commit('traction/pacbio/poolCreate/clearPoolData')
      await this.fetchPacbioTagSets().then(this.alertOnFail)

      // We should come up with a better solution to identify 'new' pools
      // Currently if the route is anything other than 'new' we assume its a pool id
      // However that is not always the case, maybe we could check the type as well.
      if (this.$route.params.id !== 'new') {
        return await this.populateLibrariesFromPool(this.$route.params.id)
      } else {
        return { success: true, errors: [] }
      }
    },
  },
}
</script>
