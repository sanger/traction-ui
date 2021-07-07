<template>
  <div>
    Pool
    <b-container id="pool" fluid>
      <b-row id="row1">
        <b-col data-type="plate-find" class="border">
          Find plates
          <PacbioLabwareFind />
        </b-col>
        <b-col>
          <b-row>
            <b-col class="border tag-set-list">
              <PacbioTagSetList></PacbioTagSetList>
            </b-col>
          </b-row>
          <b-row>
            <PacbioTagSetItem></PacbioTagSetItem>
          </b-row>
        </b-col>
      </b-row>
      <b-row id="row2">
        <b-col data-type="selected-plate-list" class="border">
          Selected plates
          <PacbioLabwareSelectedList />
        </b-col>
        <b-col data-type="library-list" class="border">
          <PacbioPoolLibraryList />
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
import PacbioPoolLibraryList from '@/components/pacbio/PacbioPoolLibraryList'

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
  async created() {
    await this.$store.dispatch('traction/pacbio/poolCreate/fetchPacbioPlates')
    await this.$store.dispatch('traction/pacbio/poolCreate/fetchPacbioTagSets')
  },
}
</script>

<style scoped>
#row1 {
  min-height: 250px;
}
#row2 {
  min-height: 750px;
}
.col {
  padding-right: 0;
}
</style>
