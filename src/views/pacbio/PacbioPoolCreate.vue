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
            <b-col data-type="tag-group-list" class="border tag-group-list">
              Find tag groups
              <PacbioTagSetList></PacbioTagSetList>
            </b-col>
          </b-row>
          <b-row>
            <b-col data-type="tag-group" class="border tag-group">
              Tag group
              <PacbioTagSetShow></PacbioTagSetShow>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row id="row2">
        <b-col data-type="selected-plate-list" class="border">
          Selected plates
          <PacbioLabwareSelectedList />
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
import PacbioTagSetShow from '@/components/pacbio/PacbioTagSetShow'
import PacbioLabwareFind from '@/components/pacbio/PacbioLabwareFind'
import PacbioLabwareSelectedList from '@/components/pacbio/PacbioLabwareSelectedList'

export default {
  name: 'PacbioPoolCreate',
  components: {
    PacbioTagSetList,
    PacbioTagSetShow,
    PacbioLabwareFind,
    PacbioLabwareSelectedList,
  },
  data() {
    return {}
  },
}
</script>

<style scoped>
#row1 {
  height: 250px;
}
#row2 {
  height: 750px;
}
.tag-group-list {
  height: 75px;
}
.tag-group {
  height: 175px;
}
</style>
