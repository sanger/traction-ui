<template>
  <DataFetcher id="pool" :fetcher="provider">
    <div class="flex flex-row">
      <div class="flex flex-col w-1/2 px-4">
        <div class="flex flex-col">
          <traction-section title="Labware" number="1a" class="mb-2">
            <div class="text-left">Find labware</div>
            <LabwareFinder :fetcher="findOntPlate" filter="barcode" class="mb-6" />
          </traction-section>
          <OntPlateSelectedList class="mb-2" />
        </div>
      </div>
      <div class="flex flex-col w-1/2 mt-6 gap-y-4">
        <div>
          <OntTagSetList ref="tagSetList" />
          <OntTagSetItem />
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
import LabwareFinder from '@/components/LabwareFinder'
import DataFetcher from '@/components/DataFetcher'

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/ont')

export default {
  name: 'ONTPoolCreate',
  components: {
    OntTagSetList,
    OntPlateSelectedList,
    OntTagSetItem,
    OntPoolEdit,
    DataFetcher,
    LabwareFinder,
  },
  //   created() {
  //     // const requests = this.fetchPacbioRequests()
  //     // const tagSets = this.fetchPacbioTagSets()
  //     // Needed due to left over pool data from previously edited pools
  //     // this.$store.commit('traction/pacbio/poolCreate/clearPoolData')
  //     if (this.$route.params.id !== 'new') {
  //       // const libraries = this.populateLibrariesFromPool(this.$route.params.id)
  //       // libraries.then(this.alertOnFail)
  //     }
  //     // We don't use await here as otherwise the handling of one response will be blocked
  //     // by the other
  //     // requests.then(this.alertOnFail)
  //     // tagSets.then(this.alertOnFail)
  //   },
  computed: {
    ...mapGetters(['selectedPlates']),
  },
  methods: {
    alertOnFail({ success, errors }) {
      if (!success) {
        this.showAlert(errors, 'danger')
      }
    },
    async provider() {
      let response = { success: false, errors: [] }
      this.setPoolData(this.$route.params.id)
      await this.fetchOntTagSets().then((res) => {
        console.log(res)
        response = res
      })
      return response
    },
    ...mapActions(['findOntPlate', 'fetchOntTagSets', 'setPoolData']),
  },
}
</script>
