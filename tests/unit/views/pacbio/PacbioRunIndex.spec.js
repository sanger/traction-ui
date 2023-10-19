import PacbioRunIndex from '@/views/pacbio/PacbioRunIndex'
import Response from '@/api/Response'
import {
  mount,
  store,
  Data,
  flushPromises,
  nextTick,
  createTestingPinia,
} from '@support/testHelper'
import { usePacbioRunsStore } from '@/stores/pacbioRuns'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate'
import { vi } from 'vitest'

const mockRuns = new Response(Data.PacbioRuns).deserialize.runs
/**
 * Helper method for mounting a component 'dataProps' if any and with a mock instance of pinia, with the given 'options'.
 * 'options' allows to define initial state while instantiating the component.
 *
 * @param {*} options - options to be passed to the createTestingPinia method for creating a mock instance of pinia
 * e.g. initialState, stubActions etc.
 * @param {*} dataProps - data to be passed to the component while mounting
 */
function factory(options, dataProps) {
  const spy = vi.fn().mockResolvedValue({ success: true, data: Data.PacbioRuns.data })
  const spy2 = vi.fn().mockResolvedValue(Data.TractionPacbioSmrtLinkVersions)

  const wrapperObj = mount(PacbioRunIndex, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioRuns: {
              runs: new Response(Data.PacbioRuns).deserialize.runs,
            },
            pacbioRunCreate: {
              resources: {
                smrtLinkVersions: new Response(Data.TractionPacbioSmrtLinkVersions).deserialize
                  .smrt_link_versions,
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
                store.api.traction.pacbio.smrt_link_versions.get = spy2
                store.api.traction.pacbio.runs = vi.fn().mockReturnValue(Data.PacbioRuns)
              }
            },
          ],
        }),
      ],
    },
    data() {
      return {
        filter: mockRuns[0].name,
        ...dataProps,
      }
    },
  })

  const runCreateStoreObj = usePacbioRunCreateStore()
  usePacbioRunsStore()

  return { wrapperObj, runCreateStoreObj }
}

describe('PacbioRunIndex.vue', () => {
  let wrapper, pacbioRunIndex, mockVersions, runCreateStore

  beforeEach(async () => {
    mockVersions = new Response(Data.TractionPacbioSmrtLinkVersions).deserialize.smrt_link_versions

    const { wrapperObj, runCreateStoreObj } = factory()
    wrapper = wrapperObj
    runCreateStore = runCreateStoreObj
    pacbioRunIndex = wrapper.vm
    await flushPromises()
  })

  describe('building the table', () => {
    it('exists', () => {
      expect(wrapper.find('table').exists()).toBeTruthy
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(6)
    })

    it('contains the correct run skbb information', async () => {
      // Within each cell, the SKBB information is displayed as a list-item per plate
      const run2skbbList = wrapper.find('tbody').findAll('tr')[0].findAll('td')[4].findAll('li')
      expect(run2skbbList.length).toEqual(1)
      const run2skbbListItem1 = run2skbbList[0]
      expect(run2skbbListItem1.text()).toEqual('Plate 1: SKBB 2')

      const run6skbbList = wrapper.find('tbody').findAll('tr')[5].findAll('td')[4].findAll('li')
      expect(run6skbbList.length).toEqual(2)
      const run6skbbListItem1 = run6skbbList[0]
      expect(run6skbbListItem1.text()).toEqual('Plate 1: SKBB 6')
      const run6skbbListItem2 = run6skbbList[1]
      expect(run6skbbListItem2.text()).toEqual('Plate 2: SKBB 7')
    })
  })

  describe('version badge', () => {
    let badges

    beforeEach(() => {
      // find all tags with class 'badge'
      badges = wrapper.find('tbody').findAll('.badge')
    })

    it('contains a badge for each run', () => {
      expect(badges.length).toEqual(6)
    })

    it('contains the correct badge text', () => {
      //rootStore.api.traction.pacbio.smrt_link_versions = mockVersions
      badges.forEach((badge, index) => {
        const version_id = mockRuns[index].pacbio_smrt_link_version_id
        const version = mockVersions.find((version) => version.id == version_id)
        const version_name = version.name.split('_')[0] // keep only the version number, dropping everything after the underscore
        expect(badge.text()).toEqual(version_name)
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
      expect(pacbioRunIndex.$route.path).toEqual('/pacbio/run/new')
    })
  })

  describe('start button', () => {
    let button

    it('is enabled when the run state is pending', () => {
      // run at(1) is in state pending
      button = wrapper.find('#startRun-1')
      expect(button.element.disabled).toBe(false)
    })

    it('is not shown if the run state is started', () => {
      // run at(2) is in state started
      button = wrapper.find('#startRun-2')
      expect(button.exists()).toBe(false)
    })

    it('is not shown if the run state is completed', () => {
      // run at(3) is in state started
      button = wrapper.find('#startRun-3')
      expect(button.exists()).toBe(false)
    })

    it('is not shown if the run state is cancelled', () => {
      // run at(4) is in state started
      button = wrapper.find('#startRun-4')
      expect(button.exists()).toBe(false)
    })

    it('on click updateRun is called', () => {
      pacbioRunIndex.updateRun = vi.fn()

      button = wrapper.find('#startRun-1')
      button.trigger('click')
      expect(pacbioRunIndex.updateRun).toBeCalledWith({ id: mockRuns[0].id, state: 'started' })
    })
  })

  describe('complete button', () => {
    let button

    it('is enabled when the run state is pending', () => {
      // run at(1) is in state pending
      button = wrapper.find('#completeRun-1')
      expect(button.exists()).toBe(false)
    })

    it('is enabled when the run state is started', () => {
      // run at(2) is in state started
      button = wrapper.find('#completeRun-2')
      expect(button.element.disabled).toBe(false)
    })

    it('is not shown if the run state is completed', () => {
      // run at(3) is in state cancelled
      button = wrapper.find('#completeRun-3')
      expect(button.exists()).toBe(false)
    })

    it('is not shown if the run state is cancelled', () => {
      // run at(4) is in state cancelled
      button = wrapper.find('#completeRun-4')
      expect(button.exists()).toBe(false)
    })

    it('on click updateRun is called', () => {
      // run at(2) is in state started
      pacbioRunIndex.updateRun = vi.fn()

      button = wrapper.find('#completeRun-2')
      button.trigger('click')

      expect(pacbioRunIndex.updateRun).toBeCalledWith({ id: mockRuns[1].id, state: 'completed' })
    })
  })

  describe('cancel button', () => {
    let button

    it('is enabled when the run state is pending', () => {
      // run at(1) is in state pending
      button = wrapper.find('#cancelRun-1')
      expect(button.exists()).toBe(false)
    })

    it('is enabled when the run state is started', () => {
      // run at(2) is in state started
      button = wrapper.find('#cancelRun-2')
      expect(button.element.disabled).toBe(false)
    })

    it('is not shown if the run state is completed', () => {
      // run at(3) is in state cancelled
      button = wrapper.find('#cancelRun-3')
      expect(button.exists()).toBe(false)
    })

    it('is not shown if the run state is cancelled', () => {
      // run at(4) is in state cancelled
      button = wrapper.find('#cancelRun-4')
      expect(button.exists()).toBe(false)
    })

    it('on click updateRun is called', () => {
      // run at(2) is in state started
      pacbioRunIndex.updateRun = vi.fn()

      button = wrapper.find('#cancelRun-2')
      button.trigger('click')

      expect(pacbioRunIndex.updateRun).toBeCalledWith({ id: mockRuns[1].id, state: 'cancelled' })
    })
  })

  describe('generate sample sheet button', () => {
    let button

    it('it exists when the run has wells with pools', () => {
      button = wrapper.find('#generate-sample-sheet-1')
      expect(button.isVisible()).toBe(true) // button is shown
    })

    it('on click generateSampleSheetPath is called', () => {
      button = wrapper.find('#generate-sample-sheet-1')

      expect(button.attributes('href')).toEqual(pacbioRunIndex.generateSampleSheetPath(1))
    })
  })

  describe('sorting', () => {
    it('will sort the runs by created at', () => {
      expect(wrapper.find('tbody').findAll('tr')[0].text()).toMatch(/Sequel II/)
    })
  })

  describe('filtering runs', () => {
    beforeEach(async () => {
      await flushPromises()
      wrapper.vm.tableData = [mockRuns[0]]
    })

    it('will filter the runs in the table', () => {
      expect(wrapper.find('tbody').findAll('[data-testid="row"]').length).toEqual(1)
      expect(wrapper.find('tbody').findAll('[data-testid="row"]')[0].text()).toMatch(/Sequel I/)
    })
  })

  describe('#showAlert', () => {
    it('emits an event with the message', () => {
      pacbioRunIndex.showAlert('show this message', 'danger')

      expect(Object.values(store.state.traction.messages)).toContainEqual({
        type: 'danger',
        message: 'show this message',
      })
    })
  })

  describe('pagination', () => {
    beforeEach(async () => {
      factory({
        perPage: 2,
        currentPage: 1,
      })
      wrapper.vm.tableData = [mockRuns[0], mockRuns[1]]
      await flushPromises()
    })

    it('will paginate the runs in the table', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
    })
  })

  describe('#updateRun', () => {
    const id = 1
    beforeEach(() => {
      pacbioRunIndex.updateRun = vi.fn()
      pacbioRunIndex.showAlert = vi.fn()
    })

    it('calls startRun successfully', () => {
      pacbioRunIndex.updateRunState('started', id)
      expect(pacbioRunIndex.updateRun).toBeCalledWith({ id, state: 'started' })
    })

    it('calls completeRun successfully', () => {
      pacbioRunIndex.updateRunState('completed', id)
      expect(pacbioRunIndex.updateRun).toBeCalledWith({ id, state: 'completed' })
    })

    it('calls cancelRun successfully', () => {
      const id = 1
      pacbioRunIndex.updateRunState('cancelled', id)
      expect(pacbioRunIndex.updateRun).toBeCalledWith({ id, state: 'cancelled' })
    })

    it('calls setRuns unsuccessfully', () => {
      pacbioRunIndex.updateRun.mockImplementation(() => {
        throw Error('Raise this error')
      })
      pacbioRunIndex.updateRunState('started', 1)
      expect(pacbioRunIndex.showAlert).toBeCalled()
    })
  })

  describe('generate sample sheet link', () => {
    let link, id

    beforeEach(() => {
      id = 1
      link = wrapper.find('#generate-sample-sheet-' + id)
    })

    it('exists', () => {
      expect(link).toBeTruthy()
    })

    it('has the correct href link', () => {
      expect(link.attributes('href')).toBe(
        import.meta.env.VITE_TRACTION_BASE_URL + '/v1/pacbio/runs/' + id + '/sample_sheet',
      )
    })
  })
 
  describe('Edit Run button', () => {
    it('contains a Edit Run button', () => {
      expect(wrapper.find('#editRun-1')).toBeDefined()
    })

    it('will call editRun when Edit is clicked', async () => {
      const button = wrapper.find('#editRun-1')
      button.trigger('click')
      await flushPromises()
      expect(pacbioRunIndex.$route.path).toEqual('/pacbio/run/1')
    })
  })
})
