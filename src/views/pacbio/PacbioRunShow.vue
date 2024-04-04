<template>
  <DataFetcher :fetcher="provider">
    <div
      class="flex flex-row items-center gap-2 p-2 mt-4 mb-4 whitespace-nowrap border border-gray-200 bg-gray-100 gap-y-4 shadow-sm hover:shadow-lg"
    >
      <router-link id="backToRunsButton" :to="{ name: 'PacbioRunIndex' }" class="text-gray-700">
        <TractionArrowIcon class="inline-block h-4 w-4" />
        <span class="align-middle whitespace-nowrap underline underline-offset-2 font-bold"
          >Back to runs</span
        >
      </router-link>
      <div class="flex flex-row w-full w-1/2 justify-end">
        <traction-button v-if="newRecord" id="reset" theme="reset" @click="resetRun()"
          >Reset</traction-button
        >

        <traction-button
          :id="store.runTypeItem.id"
          :theme="store.runTypeItem.theme"
          :data-action="store.runTypeItem.id"
          @click="save"
          >{{ store.runTypeItem.label }}</traction-button
        >
      </div>
    </div>

    <div class="grid grid-cols-2 w-full space-x-4 mb-6">
      <PacbioRunInfoEdit ref="pacbioRunInfoEdit" :new-record="newRecord" />
      <PacbioRunWellDefaultEdit ref="pacbioRunWellDefaultEdit" />
    </div>

    <div class="grid grid-cols-2 w-full space-x-4 mb-6">
      <PacbioRunPoolLibraryList ref="pacbioRunPoolLibraryList" />
      <PacbioPlateList ref="plate" @alert="showAlert" />
    </div>
  </DataFetcher>
</template>
<script setup>
/**
 * @name PacbioRunShow
 * @description This component is used to display the form for creating a new Pacbio Run or editing an existing one.
 * @param {Number|String} id - The id of the run to edit page
 *
 */
import TractionArrowIcon from '@/components/shared/icons/TractionArrowIcon.vue'
import PacbioRunInfoEdit from '@/components/pacbio/PacbioRunInfoEdit.vue'
import PacbioRunWellDefaultEdit from '@/components/pacbio/PacbioRunWellDefaultEdit.vue'
import PacbioRunPoolLibraryList from '@/components/pacbio/PacbioRunPoolLibraryList.vue'
import PacbioPlateList from '@/components/pacbio/PacbioRunPlateList.vue'
import DataFetcher from '@/components/DataFetcher.vue'
import { RunTypeEnum } from '@/stores/utilities/run.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import useAlert from '@/composables/useAlert.js'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

/** Create a store instance of the pacbioRunCreateStore*/
const store = usePacbioRunCreateStore()

/*`showAlert` is a function extracted from the `useAlert` composable.
It's used to display alert messages in the application*/
const { showAlert } = useAlert()

/*`router` is an instance of the Vue Router.
It's used to navigate between different routes in the application.*/
const router = useRouter()

/*
 * Define props for the component
 * `id` is the id of the run to edit page
 */
const props = defineProps({
  id: {
    type: [String, Number],
    default: 0,
  },
})

/**
 * Computed property that returns true if the run type is 'New'.
 * @returns {Boolean} - True if the run type is 'New'
 */
const newRecord = computed(() => store.runTypeItem.type === RunTypeEnum.New)

/**
 * Resets the run data and sets the run, default well attributes, and instrument data.
 * Shows a success alert message after resetting the run.
 * @async
 */
const resetRun = async () => {
  store.clearRunData()
  await store.setRun({ id: props.id })
  await store.setDefaultWellAttributes()
  await store.setInstrumentData()
  showAlert('Run has been reset', 'success', 'run-validation-message')
}

/**
 * Redirects to the Pacbio Run Index page.
 */
const redirectToRuns = () => {
  router.push({ name: 'PacbioRunIndex' })
}

/**
 * Saves the run and shows a success or error alert message based on the result.
 * If the run is saved successfully, it redirects to the PacbioRunIndex page.
 */
const save = () => {
  store.saveRun().then(({ success, errors }) => {
    success
      ? showAlert(`Run successfully ${store.runTypeItem.action}d`, 'success', 'run-create-message')
      : showAlert('Failed to create run in Traction: ' + errors, 'danger', 'run-create-message')
    if (success) {
      redirectToRuns()
    }
  })
}

/**
 * Fetches the SMRT Link versions, clears the run data, and sets the run, default well attributes, and instrument data.
 * @returns {Promise<Object>} A promise that resolves with an object containing a success property set to true.
 */
const provider = async () => {
  await store.fetchSmrtLinkVersions()
  store.clearRunData()
  await store.setRun({ id: props.id })
  await store.setDefaultWellAttributes()
  await store.setInstrumentData()
  return { success: true }
}
</script>
