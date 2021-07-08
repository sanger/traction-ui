<template>
  <div>
    Pool
    <b-container id="pool" fluid>
      <b-row>
        <b-col data-type="plate-find" class="border">
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
      <b-row>
        <b-col data-type="selected-plate-list" class="border">
          <PacbioLabwareSelectedList />
        </b-col>
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
.col {
  padding-right: 0;
}
</style>
