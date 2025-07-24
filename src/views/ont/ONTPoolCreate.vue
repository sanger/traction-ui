<template>
  <!-- The data fetcher key is used to re-render the page if a user goes from an existing pool to a new one -->
  <DataFetcher id="pool" :key="$route.fullPath" :fetcher="provider">
    <div class="flex flex-col pt-4">
      <div class="flex flex-col w-1/2 px-4">
        <traction-menu :border="true">
          <traction-menu-item
            v-for="(tabTitle, index) in tabTitles"
            :key="index"
            :active="index == sourceIndex"
            color="blue"
            @click="setSource(index)"
            >{{ tabTitle }}</traction-menu-item
          >
        </traction-menu>
      </div>
      <div class="w-full grid grid-cols-2 space-x-2 mt-4">
        <div v-if="sourceIndex == 0" class="flex flex-col">
          <traction-section title="Plates" number="1a" class="mb-2">
            <div class="text-left">Find plates</div>
            <LabwareFinder :fetcher="store.findOntPlate" filter="barcode" class="mb-6" />
          </traction-section>
        </div>
        <div v-else>
          <traction-section title="Tubes" number="2a" class="mb-2">
            <div class="text-left">Find Tubes</div>
            <LabwareFinder :fetcher="storefindOntTube" filter="barcode" class="mb-6" />
          </traction-section>
        </div>
        <div>
          <OntTagSetList ref="tagSetList" />
          <OntTagSetItem />
        </div>
        <div v-if="sourceIndex == 0" class="flex flex-col">
          <OntPlateSelectedList class="mb-2" />
        </div>
        <div v-else>
          <OntTubeSelectedList class="mb-2" />
        </div>
        <div>
          <OntPoolEdit />
        </div>
      </div>
    </div>
  </DataFetcher>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'
import OntTagSetList from '@/components/ont/OntTagSetList'
import OntPlateSelectedList from '@/components/ont/OntPlateSelectedList'
import OntTagSetItem from '@/components/ont/OntTagSetItem'
import OntPoolEdit from '@/components/ont/OntPoolEdit'
import OntTubeSelectedList from '@/components/ont/OntTubeSelectedList'
import LabwareFinder from '@/components/LabwareFinder'
import DataFetcher from '@/components/DataFetcher'

/**
 * Composition API setup for ONTPoolCreate view.
 * Handles pool creation, tab switching, and data fetching for ONT plates/tubes.
 *
 * @module ONTPoolCreate
 */

/**
 * Index of the currently selected source tab (0: Plates, 1: Tubes)
 * @type {import('vue').Ref<number>}
 */
const sourceIndex = ref(0)

/**
 * Titles for the source selection tabs
 * @type {string[]}
 */
const tabTitles = ['Add Plates', 'Add Tubes']

/**
 * Vue Router route object for accessing route params
 */
const route = useRoute()

/**
 * Pinia store for ONT pool creation logic and state
 */
const store = useOntPoolCreateStore()

/**
 * Sets the current source tab (Plates or Tubes)
 * @param {number} indx - Index of the tab to activate
 */
function setSource(indx) {
  sourceIndex.value = indx
}

/**
 * Fetches pool data and tag sets for the current pool ID from the route.
 * Used as the fetcher for DataFetcher component.
 * @returns {Promise<any>} Resolves when data is loaded
 */
async function provider() {
  await store.setPoolData(route.params.id)
  return await store.fetchOntTagSets()
}
</script>
