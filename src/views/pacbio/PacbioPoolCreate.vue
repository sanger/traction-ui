<template>
  <div>
    <traction-container id="pool" fluid>
      <traction-row>
        <traction-col md="12" lg="6">
          <traction-tabs content-class="mt-3" fill no-fade>
            <traction-tab title="Add Plates">
              <PacbioPlateFind ref="labwareFind" />
              <PacbioPlateSelectedList />
            </traction-tab>
            <traction-tab title="Add Tubes">
              <PacbioTubeFind ref="labwareFind" />
              <PacbioTubeSelectedList
            /></traction-tab>
          </traction-tabs>
        </traction-col>
        <traction-col md="12" lg="6">
          <PacbioTagSetList ref="tagSetList" />
          <PacbioTagSetItem />
          <PacbioPoolEdit />
        </traction-col>
      </traction-row>
    </traction-container>
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
    return {}
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
    ...mapActions(['fetchPacbioRequests', 'fetchPacbioTagSets', 'populateLibrariesFromPool']),
  },
}
</script>

<style scoped></style>
