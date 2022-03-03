<template>
  <div>
    <b-container id="pool" fluid>
      <b-row>
        <b-col md="12" lg="6">
          <PacbioLabwareFind ref="labwareFind" />
          <PacbioLabwareSelectedList />
        </b-col>
        <b-col md="12" lg="6">
          <PacbioTagSetList ref="tagSetList" />
          <PacbioTagSetItem />
          <PacbioPoolEdit />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import PacbioTagSetList from '@/components/pacbio/PacbioTagSetList'
import PacbioLabwareFind from '@/components/pacbio/PacbioLabwareFind'
import PacbioLabwareSelectedList from '@/components/pacbio/PacbioLabwareSelectedList'
import PacbioTagSetItem from '@/components/pacbio/PacbioTagSetItem'
import PacbioPoolEdit from '@/components/pacbio/PacbioPoolEdit'

import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PacbioPoolCreate',
  components: {
    PacbioTagSetList,
    PacbioLabwareFind,
    PacbioLabwareSelectedList,
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
