<template>
  <div>
    Pool
    <b-container id="pool" fluid>
      <b-row id="row1">
        <b-col data-type="plate-find" class="border">
          Find plates
        </b-col>
        <b-col>
          <b-row>
            <b-col class="border tag-set-list">
              Find tag groups
              <PacbioTagSetList></PacbioTagSetList>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="border tag-set-item">
              Tag group
              <PacbioTagSetItem></PacbioTagSetItem>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row id="row2">
        <b-col data-type="selected-plate-list" class="border">
          Selected plates
        </b-col>
        <b-col data-type="library-list" class="border">
          Libraries
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import PacbioTagSetList from '@/components/pacbio/PacbioTagSetList'
import PacbioTagSetItem from '@/components/pacbio/PacbioTagSetItem'

export default {
  name: 'PacbioPoolCreate',
  components: {
    PacbioTagSetList,
    PacbioTagSetItem,
  },
  data() {
    return {}
  },
  async created() {
    await this.$store.dispatch('traction/pacbio/poolCreate/fetchPacbioTagSets')
  }
}
</script>

<style scoped>
#row1 {
  height: 250px;
}
#row2 {
  height: 750px;
}
.tag-set-list {
  height: 75px;
}
.tag-set-item {
  height: 175px;
}
</style>
