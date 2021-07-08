<template>
  <div>
    <h3>Selected plates</h3>
    <b-tabs content-class="mt-3" fill>
      <b-tab title="Plates">
        <b-list-group class="selected-list-group">
          <b-list-group-item v-if="selectedPlates.length === 0">
            No plates selected
          </b-list-group-item>
          <b-list-group-item
            v-for="plate in selectedPlates"
            :key="plate.id"
            class="selected-list-item"
          >
            {{ plate.barcode }}
            <Plate ref="plate" v-bind="plate" @clickWell="selectWellRequests"></Plate>
          </b-list-group-item>
        </b-list-group>
      </b-tab>
      <b-tab title="Requests"> </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import Helper from '@/mixins/Helper'
import Plate from '@/components/pacbio/PacbioPlateItem'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers(
  'traction/pacbio/poolCreate',
)

export default {
  name: 'PacbioLabwareSelectedList',
  components: {
    Plate,
  },
  mixins: [Helper],
  computed: {
    ...mapGetters(['selectedPlates']),
  },
  methods: {
    ...mapMutations(['selectPlate']),
    ...mapActions(['selectWellRequests']),
  },
}
</script>

<style scoped lang="scss">
@import 'src/styles/components.scss';
.selected-list-group {
  overflow: scroll;
  max-height: 700px;
}
</style>
