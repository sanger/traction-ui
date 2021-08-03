<template>
  <div>
    <b-container id="pool" fluid>
      <b-row>
        <PacbioLabwareFind ref="labwareFind" />
        <b-col>
          <b-row>
            <PacbioTagSetList ref="tagSetList" />
          </b-row>
          <b-row>
            <PacbioTagSetItem />
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <PacbioLabwareSelectedList />
        <PacbioPoolEdit />
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
    const plates = this.fetchPacbioPlates()
    const tagSets = this.fetchPacbioTagSets()

    if (this.$route.params.id !== 'new') {
      const libraries = this.populateLibrariesFromPool(this.$route.params.id)
      libraries.then(this.plateAlert)
    }
    // We don't use await here as otherwise the handling of one response will be blocked
    // by the other
    plates.then(this.plateAlert)
    tagSets.then(this.tagSetAlert)
  },
  methods: {
    plateAlert({ success, errors }) {
      if (!success) {
        this.$refs['labwareFind'].showAlert(errors, 'danger')
      }
    },
    tagSetAlert({ success, errors }) {
      if (!success) {
        this.$refs['tagSetList'].showAlert(errors, 'danger')
      }
    },
    ...mapActions(['fetchPacbioPlates', 'fetchPacbioTagSets', 'populateLibrariesFromPool']),
  },
}
</script>

<style scoped></style>
