<template>
  <div>
    <b-container id="pool" fluid>
      <b-row>
        <PacbioLabwareFind ref="labwareFind" />
        <b-col>
          <b-row>
            <PacbioTagSetList ref="tagSetList"></PacbioTagSetList>
          </b-row>
          <b-row>
            <PacbioTagSetItem></PacbioTagSetItem>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <PacbioLabwareSelectedList />
        <PacbioPoolLibraryList />
      </b-row>
    </b-container>
  </div>
</template>

<script>
import PacbioTagSetList from '@/components/pacbio/PacbioTagSetList'
import PacbioLabwareFind from '@/components/pacbio/PacbioLabwareFind'
import PacbioLabwareSelectedList from '@/components/pacbio/PacbioLabwareSelectedList'
import PacbioTagSetItem from '@/components/pacbio/PacbioTagSetItem'
import PacbioPoolLibraryList from '@/components/pacbio/PacbioPoolLibraryList'

import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PacbioPoolCreate',
  components: {
    PacbioTagSetList,
    PacbioLabwareFind,
    PacbioLabwareSelectedList,
    PacbioTagSetItem,
    PacbioPoolLibraryList,
  },
  data() {
    return {}
  },
  created() {
    const plates = this.fetchPacbioPlates()
    const tagSets = this.fetchPacbioTagSets()
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
    ...mapActions(['fetchPacbioPlates', 'fetchPacbioTagSets']),
  },
}
</script>

<style scoped></style>
