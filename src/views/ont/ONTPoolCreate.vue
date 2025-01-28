<template>
  <!-- The data fetcher key is used to re-render the page if a user goes from an existing pool to a new one -->
  <DataFetcher id="pool" :key="$route.fullPath" :fetcher="provider">
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
      <div class="w-full grid grid-cols-2 space-x-2 mt-4">
        <div v-if="sourceIndex == 0" class="flex flex-col">
          <traction-section title="Plates" number="1a" class="mb-2">
            <div class="text-left">Find plates</div>
            <LabwareFinder :fetcher="findOntPlate" filter="barcode" class="mb-6" />
          </traction-section>
        </div>
        <div v-else>
          <traction-section title="Tubes" number="2a" class="mb-2">
            <div class="text-left">Find Tubes</div>
            <LabwareFinder :fetcher="findOntTube" filter="barcode" class="mb-6" />
          </traction-section>
        </div>
        <div>
          <OntTagSetList ref="tagSetList" />
          <OntTagSetItem />
        </div>
        <div v-if="sourceIndex == 0" class="flex flex-col">
          <OntPlateSelectedList class="mb-2" />
        </div>
        <div v-else>
          <OntTubeSelectedList class="mb-2" />
        </div>
        <div>
          <OntPoolEdit />
        </div>
      </div>
    </div>
  </DataFetcher>
</template>

<script>
import OntTagSetList from '@/components/ont/OntTagSetList'
import OntPlateSelectedList from '@/components/ont/OntPlateSelectedList'
import OntTagSetItem from '@/components/ont/OntTagSetItem'
import OntPoolEdit from '@/components/ont/OntPoolEdit'
import OntTubeSelectedList from '@/components/ont/OntTubeSelectedList'
import LabwareFinder from '@/components/LabwareFinder'
import DataFetcher from '@/components/DataFetcher'

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/ont/pools')

export default {
  name: 'ONTPoolCreate',
  components: {
    OntTagSetList,
    OntPlateSelectedList,
    OntTagSetItem,
    OntPoolEdit,
    OntTubeSelectedList,
    DataFetcher,
    LabwareFinder,
  },
  data() {
    return { sourceIndex: 0, tabTitles: ['Add Plates', 'Add Tubes'] }
  },
  computed: {
    ...mapGetters(['selectedPlates']),
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
    async provider() {
      await this.setPoolData(this.$route.params.id)
      return await this.fetchOntTagSets().then((res) => res)
    },
    ...mapActions(['findOntPlate', 'findOntTube', 'fetchOntTagSets', 'setPoolData']),
  },
}
</script>
