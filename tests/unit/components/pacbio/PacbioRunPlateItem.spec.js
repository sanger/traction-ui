import { mount, localVue, store } from '@support/testHelper'
import Plate from '@/components/pacbio/PacbioRunPlateItem'
import PlateMap from '@/config/PlateMap'
import { Data } from '@support/testHelper'
import Response from '@/api/Response'

describe('Plate.vue', () => {
  let plate, wrapper

  beforeEach(() => {
    const run = new Response(Data.PacbioRun).deserialize.runs[0]

    // smrt link versions are retrieved by PacbioRunShow view
    // smrt_link_version_id is set on the currentRun by newRun and editRun actions
    run.smrt_link_version_id = run.pacbio_smrt_link_version_id
    const smrtLinkVersions = {
      1: { id: 1, name: 'v10', default: true },
      2: { id: 2, name: 'v11', default: false },
    }
    store.commit('traction/pacbio/runCreate/populateRun', run)
    store.state.traction.pacbio.runCreate.resources.smrtLinkVersions = smrtLinkVersions

    wrapper = mount(Plate, { localVue, store })
    plate = wrapper.vm
  })

  it('will be defined', () => {
    expect(plate).toBeDefined()
  })

  describe('wells', () => {
    it('has the correct number of wells', () => {
      const ellipses = wrapper.findAll('ellipse')
      expect(ellipses.length).toEqual(Object.keys(PlateMap.wells).length)
    })
  })
})
