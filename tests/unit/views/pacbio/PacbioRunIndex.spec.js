import PacbioRunIndex from '@/views/pacbio/PacbioRunIndex'
import { mount, flushPromises, nextTick, createTestingPinia, router } from '@support/testHelper'
import { usePacbioRunsStore } from '@/stores/pacbioRuns.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import { beforeEach, vi } from 'vitest'
import PacbioRunFactory from '@tests/factories/PacbioRunFactory.js'
import PacbioSmrtLinkVersionFactory from '@tests/factories/PacbioSmrtLinkVersionFactory.js'

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

// TODO: This needs a refactor to include the way the store data is being created.
const pacbioRunFactory = PacbioRunFactory()
const pacbioSmrtLinkVersionFactory = PacbioSmrtLinkVersionFactory()

const getRunAndButtonForState = (wrapper, state, action) => {
  const run = pacbioRunFactory.storeData.getRunByState(state)
  const button = wrapper.find(`#${action}Run-${run.id}`)
  return { run, button }
}

/**
 * Helper method for mounting a component 'dataProps' if any and with a mock instance of pinia, with the given 'options'.
 * 'options' allows to define initial state while instantiating the component.
 *
 * @param {*} options - options to be passed to the createTestingPinia method for creating a mock instance of pinia
 * e.g. initialState, stubActions etc.
 * @param {*} dataProps - data to be passed to the component while mounting
 */
function factory(options, dataProps) {
  const spy = vi.fn().mockResolvedValue(pacbioRunFactory.responses.fetch)

  // this is in the pacbioRunCreate store so didn't weant to change it to v2.
  const spy2 = vi.fn().mockResolvedValue(pacbioSmrtLinkVersionFactory.responses.axios)

  const wrapperObj = mount(PacbioRunIndex, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioRuns: {
              runs: {},
            },
            pacbioRunCreate: {
              resources: {
                smrtLinkVersions: pacbioSmrtLinkVersionFactory.storeData,
              },
            },
            root: {},
          },
          stubActions: false,
          plugins: [
            ({ store }) => {
              if (store.$id === 'pacbioRuns') {
                store.runRequest.get = spy
              }
              if (store.$id === 'root') {
                store.api.v1.traction.pacbio.smrt_link_versions.get = spy2
                store.api.v2.traction.pacbio.runs = vi
                  .fn()
                  .mockReturnValue(pacbioRunFactory.responses.fetch)
              }
            },
          ],
        }),
      ],
    },
    data() {
      return {
        ...dataProps,
      }
    },
  })

  const runCreateStoreObj = usePacbioRunCreateStore()
  const runsStoreObj = usePacbioRunsStore()

  return { wrapperObj, runCreateStoreObj, runsStoreObj }
}

describe('PacbioRunIndex.vue', () => {
  let wrapper, pacbioRunIndex, runCreateStore, runsStore

  beforeEach(async () => {
    const { wrapperObj, runCreateStoreObj, runsStoreObj } = factory()
    wrapper = wrapperObj
    runCreateStore = runCreateStoreObj
    runsStore = runsStoreObj
    pacbioRunIndex = wrapper.vm
    await flushPromises()
  })

  describe('building the table', () => {
    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(
        Object.values(pacbioRunFactory.storeData.runs).length,
      )
    })

    // it would be better to move this to use data-id so we can test by run id
    it('contains the correct run sequencing kit box barcode information', async () => {
      // Within each cell, the SKBB information is displayed as a list-item per plate

      const checkSequenceKitBoxBarcodes = (index) => {
        const run = wrapper.find('tbody').findAll('tr')[index]
        const storeRun = pacbioRunFactory.storeData.runs[run.find('#id').text()]
        const plates = storeRun.plates.map((id) => pacbioRunFactory.storeData.plates[id])
        const sequencingKitBoxBarcodes = run.find('#sequencing_kit_box_barcodes').findAll('li')

        for (let i = 0; i < plates.length; i++) {
          expect(sequencingKitBoxBarcodes[i].text()).toEqual(
            `Plate ${plates[i].plate_number}: ${plates[i].sequencing_kit_box_barcode}`,
          )
        }
      }

      // Run 1
      checkSequenceKitBoxBarcodes(1)

      // Run 2
      checkSequenceKitBoxBarcodes(Object.values(pacbioRunFactory.storeData.runs).length - 1)
    })
  })

  describe('version badge', () => {
    it('contains a badge for each run', () => {
      const badges = wrapper.find('tbody').findAll('.badge')
      expect(badges.length).toEqual(Object.values(pacbioRunFactory.storeData.runs).length)
    })

    it('contains the correct badge text', () => {
      wrapper
        .find('tbody')
        .findAll('tr')
        .forEach((row) => {
          const run_id = row.find('#id').text()
          const badge = row.find('.badge').text()
          const version_id = pacbioRunFactory.storeData.runs[run_id].pacbio_smrt_link_version_id
          const version = runCreateStore.smrtLinkVersionList[version_id]
          expect(badge).toEqual(version.name.split('_')[0])
        })
    })

    it('displays an error badge if the version is not found', async () => {
      // Remove smrtLinkVersions from state
      runCreateStore.resources.smrtLinkVersions = {}
      await nextTick()
      const badgesMissing = wrapper.find('tbody').findAll('.badge')
      expect(badgesMissing[0].text()).toEqual('< ! >')
    })
  })

  describe('new run button', () => {
    it('contains a create new run button', () => {
      expect(wrapper.find('[data-action=new-run]').exists()).toBeTruthy()
    })

    it('will redirect to the run when newRun is clicked', async () => {
      const button = wrapper.find('[data-action=new-run]')
      button.trigger('click')
      await flushPromises()
      expect(router.currentRoute.value.path).toEqual('/pacbio/run/new')
    })
  })

  describe('start button', () => {
    it('is enabled when the run state is pending', () => {
      const { button } = getRunAndButtonForState(wrapper, 'pending', 'start')
      expect(button.element.disabled).toBe(false)
    })

    it('is not shown if the run state is started', () => {
      const { button } = getRunAndButtonForState(wrapper, 'started', 'start')
      expect(button.exists()).toBe(false)
    })

    it('is not shown if the run state is completed', () => {
      const { button } = getRunAndButtonForState(wrapper, 'completed', 'start')
      expect(button.exists()).toBe(false)
    })

    it('is not shown if the run state is cancelled', () => {
      const { button } = getRunAndButtonForState(wrapper, 'cancelled', 'start')
      expect(button.exists()).toBe(false)
    })

    it('on click updateRun is called', () => {
      runsStore.updateRun = vi.fn()
      const { button, run } = getRunAndButtonForState(wrapper, 'pending', 'start')
      button.trigger('click')
      expect(runsStore.updateRun).toBeCalledWith({ id: run.id, state: 'started' })
    })
  })

  describe('complete button', () => {
    it('is enabled when the run state is pending', () => {
      const { button } = getRunAndButtonForState(wrapper, 'pending', 'complete')
      expect(button.exists()).toBe(false)
    })

    it('is enabled when the run state is started', () => {
      const { button } = getRunAndButtonForState(wrapper, 'started', 'complete')
      expect(button.element.disabled).toBe(false)
    })

    it('is not shown if the run state is completed', () => {
      const { button } = getRunAndButtonForState(wrapper, 'completed', 'complete')
      expect(button.exists()).toBe(false)
    })

    it('is not shown if the run state is cancelled', () => {
      const { button } = getRunAndButtonForState(wrapper, 'cancelled', 'complete')
      expect(button.exists()).toBe(false)
    })

    it('on click updateRun is called', () => {
      // run at(2) is in state started
      runsStore.updateRun = vi.fn()

      const { button, run } = getRunAndButtonForState(wrapper, 'started', 'complete')
      button.trigger('click')

      expect(runsStore.updateRun).toBeCalledWith({ id: run.id, state: 'completed' })
    })
  })

  describe('cancel button', () => {
    it('is enabled when the run state is pending', () => {
      const { button } = getRunAndButtonForState(wrapper, 'pending', 'cancel')
      expect(button.exists()).toBe(false)
    })

    it('is enabled when the run state is started', () => {
      const { button } = getRunAndButtonForState(wrapper, 'started', 'cancel')
      expect(button.element.disabled).toBe(false)
    })

    it('is not shown if the run state is completed', () => {
      const { button } = getRunAndButtonForState(wrapper, 'completed', 'cancel')
      expect(button.exists()).toBe(false)
    })

    it('is not shown if the run state is cancelled', () => {
      const { button } = getRunAndButtonForState(wrapper, 'cancelled', 'cancel')
      expect(button.exists()).toBe(false)
    })

    it('on click updateRun is called', () => {
      runsStore.updateRun = vi.fn()

      const { button, run } = getRunAndButtonForState(wrapper, 'started', 'cancel')
      button.trigger('click')
      expect(runsStore.updateRun).toBeCalledWith({ id: run.id, state: 'cancelled' })
    })
  })

  describe('generate sample sheet button', () => {
    let run

    beforeEach(() => {
      run = Object.values(pacbioRunFactory.storeData.runs)[0]
    })

    it('it exists when the run has wells with pools', () => {
      const button = wrapper.find(`#generate-sample-sheet-${run.id}`)
      expect(button.isVisible()).toBe(true) // button is shown
    })

    it('on click generateSampleSheetPath is called', () => {
      pacbioRunIndex.downloadCSV = vi.fn()
      const button = wrapper.find(`#generate-sample-sheet-${run.id}`)
      button.trigger('click')

      expect(pacbioRunIndex.downloadCSV).toBeCalledWith({
        id: run.id,
        name: run.name,
      })
    })

    it('on click generateSampleSheetPath is called and shows an error when the version is invalid', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: vi
          .fn()
          .mockResolvedValue({ error: 'SMRTLink sample sheet version (v10) is invalid' }),
      })

      const button = wrapper.find(`#generate-sample-sheet-${run.id}`)
      button.trigger('click')

      await flushPromises()
      expect(mockShowAlert).toBeCalledWith(
        'SMRTLink sample sheet version (v10) is invalid',
        'danger',
      )
    })

    it('on click generateSampleSheetPath is called and shows an error when there is a network error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'))
      const button = wrapper.find(`#generate-sample-sheet-${run.id}`)
      button.trigger('click')

      await flushPromises()
      expect(mockShowAlert).toBeCalledWith('Error: Failed to fetch', 'danger')
    })
  })

  describe('sorting', () => {
    it('will sort the runs by created at', () => {
      const runs = Object.values(pacbioRunFactory.storeData.runs)
      const sortedRuns = runs.sort((a, b) => a.created_at.localeCompare(b.created_at)).reverse()
      expect(wrapper.find('tbody').findAll('#id')[0].text()).toMatch(sortedRuns[0].id)
    })
  })

  describe('#updateRun', () => {
    let id
    beforeEach(() => {
      runsStore.updateRun = vi.fn()
      id = Object.values(pacbioRunFactory.storeData.runs)[0].id
    })

    it('calls startRun successfully', () => {
      pacbioRunIndex.updateRunState('started', id)
      expect(runsStore.updateRun).toBeCalledWith({ id, state: 'started' })
    })

    it('calls completeRun successfully', () => {
      pacbioRunIndex.updateRunState('completed', id)
      expect(runsStore.updateRun).toBeCalledWith({ id, state: 'completed' })
    })

    it('calls cancelRun successfully', () => {
      pacbioRunIndex.updateRunState('cancelled', id)
      expect(runsStore.updateRun).toBeCalledWith({ id, state: 'cancelled' })
    })

    it('calls setRuns unsuccessfully', () => {
      runsStore.updateRun.mockImplementation(() => {
        throw Error('Raise this error')
      })
      pacbioRunIndex.updateRunState('started', id)
      expect(mockShowAlert).toBeCalled()
    })
  })

  describe('Edit Run button', () => {
    let id
    beforeEach(() => {
      id = Object.values(pacbioRunFactory.storeData.runs)[0].id
    })

    it('contains a Edit Run button', () => {
      expect(wrapper.find(`#editRun-${id}`)).toBeDefined()
    })

    it('will call editRun when Edit is clicked', async () => {
      const button = wrapper.find(`#editRun-${id}`)
      button.trigger('click')
      await flushPromises()
      expect(router.currentRoute.value.path).toEqual(`/pacbio/run/${id}`)
    })
  })
})
