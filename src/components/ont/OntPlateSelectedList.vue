<template>
  <div data-type="selected-plate-list">
    <!-- eslint-disable vue/attribute-hyphenation-->
    <VueSelecto
      :container="$el"
      :selectableTargets="['ellipse.filled']"
      :continueSelect="true"
      :keyContainer="$el"
      hitRate="20"
      @select="onSelect"
    />
    <traction-section number="1b" title="Selected Plates">
      <div class="flex flex-col">
        <traction-menu :border="true">
          <traction-menu-item
            v-for="(tabTitle, index) in tabTitles"
            :key="index"
            :active="index == sourceIndex"
            color="blue"
            @click.native="setSource(index)"
            >{{ tabTitle }}</traction-menu-item
          >
        </traction-menu>
        <div v-if="sourceIndex == 0" class="wrapper">
          <div v-if="selectedPlates.length == 0" data-type="warning-message" class="mt-4">
            No plates selected
          </div>

          <div v-for="plate in selectedPlates" :key="plate.id" data-type="selected-plate-item">
            {{ plate.barcode }}
            <Plate ref="plate" v-bind="plate" :wellData="wellList(plate.wells)"></Plate>
            <traction-button class="mt-0" @click="deselectPlateAndContents(plate.id)"
              >Remove</traction-button
            >
          </div>
        </div>
        <div v-else class="mt-4">
          <traction-list-group class="selected-list-group">
            <traction-table
              :items="selectedPlateRequests"
              show-empty
              small
              :fields="requestFields"
              :tbody-tr-class="rowClass"
              empty-text="No plates selected"
              @row-clicked="requestClicked"
            ></traction-table>
          </traction-list-group>
        </div>
      </div>
    </traction-section>
  </div>
</template>

<script>
import Plate from '@/components/ont/OntPlateItem'
import { createNamespacedHelpers } from 'vuex'
import { VueSelecto } from 'vue-selecto'

const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers('traction/ont')

export default {
  name: 'OntLabwareSelectedList',
  components: {
    Plate,
    VueSelecto,
  },
  data() {
    return {
      requestFields: ['id', 'sample_name', 'data_type', 'library_type', 'number_of_flowcells'],
      sourceIndex: 0,
      tabTitles: ['Plates', 'Requests'],
    }
  },
  computed: {
    ...mapGetters(['selectedPlates', 'wellList', 'requestList']),
    selectedPlateRequests() {
      return this.selectedPlates.flatMap((plate) => {
        return this.wellList(plate.wells).flatMap((well) => {
          return this.requestList(well.requests || [])
        })
      })
    },
  },
  methods: {
    ...mapMutations(['selectPlate', 'selectRequest']),
    ...mapActions(['selectWellRequests', 'deselectPlateAndContents']),
    requestClicked({ id, selected }) {
      this.selectRequest({ id, selected: !selected })
    },
    rowClass(item) {
      if (item && item.selected) {
        return 'table-primary'
      }
    },
    onSelect(e) {
      e.added.forEach((el) => {
        this.selectWellRequests(el.__vue__.$attrs.id)
      })
      e.removed.forEach((el) => {
        this.selectWellRequests(el.__vue__.$attrs.id)
      })
    },
    setSource(indx) {
      this.sourceIndex = indx
    },
  },
}
</script>

<style scoped lang="scss">
@import 'src/styles/components.scss';
.wrapper {
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
}
.wrapper > div {
  width: 50%;
}
</style>
