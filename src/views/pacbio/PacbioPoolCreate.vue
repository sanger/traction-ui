<template>
  <div id="pool">
    <div class="flex flex-row">
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
        <div v-if="sourceIndex == 0" class="flex flex-col" >
          <PacbioPlateFind class="mb-6" />
          <PacbioPlateSelectedList class="mb-2" />
        </div>
        <div v-else>
          <PacbioTubeFind class="mb-2" />
          <PacbioTubeSelectedList />
        </div>
      </div>
      <div class="flex flex-col w-1/2 mt-6">
        <PacbioTagSetList ref="tagSetList" />
        <PacbioTagSetItem />
        <PacbioPoolEdit />
      </div>
    </div>
  </div>
</template>

<script>
import PacbioTagSetList from '@/components/pacbio/PacbioTagSetList'
import PacbioPlateFind from '@/components/pacbio/PacbioPlateFind'
import PacbioPlateSelectedList from '@/components/pacbio/PacbioPlateSelectedList'
import PacbioTubeFind from '@/components/pacbio/PacbioTubeFind'
import PacbioTubeSelectedList from '@/components/pacbio/PacbioTubeSelectedList'
import PacbioTagSetItem from '@/components/pacbio/PacbioTagSetItem'
import PacbioPoolEdit from '@/components/pacbio/PacbioPoolEdit'

import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PacbioPoolCreate',
  components: {
    PacbioTagSetList,
    PacbioPlateFind,
    PacbioPlateSelectedList,
    PacbioTubeFind,
    PacbioTubeSelectedList,
    PacbioTagSetItem,
    PacbioPoolEdit,
  },

  data() {
    return { sourceIndex: 0, tabTitles: ['Add Plates', 'Add Tubes'] }
  },
  created() {
    const requests = this.fetchPacbioRequests()
    const tagSets = this.fetchPacbioTagSets()
    // Needed due to left over pool data from previously edited pools
    this.$store.commit('traction/pacbio/poolCreate/clearPoolData')

    if (this.$route.params.id !== 'new') {
      const libraries = this.populateLibrariesFromPool(this.$route.params.id)
      libraries.then(this.alertOnFail)
    }
    // We don't use await here as otherwise the handling of one response will be blocked
    // by the other
    requests.then(this.alertOnFail)
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
    ...mapActions(['fetchPacbioRequests', 'fetchPacbioTagSets', 'populateLibrariesFromPool']),
  },
}
</script>

<style scoped></style>
