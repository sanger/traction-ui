<template>
  <div>
    <b-container id="pool" fluid>
      <b-row>
        <PacbioLabwareFind />
        <b-col>
          <b-row>
            <PacbioTagSetList></PacbioTagSetList>
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
    this.fetchPacbioPlates()
    this.fetchPacbioTagSets()
  },
  methods: {
    ...mapActions(['fetchPacbioPlates', 'fetchPacbioTagSets']),
  },
}
</script>

<style scoped></style>
