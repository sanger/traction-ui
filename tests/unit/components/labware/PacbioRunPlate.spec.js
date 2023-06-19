import { mount, localVue, store } from '@support/testHelper'
import PacbioRunPlate from '@/components/labware/PacbioRunPlate'
import { Data } from '@support/testHelper'
import Response from '@/api/Response'
import { it } from 'vitest'

describe('PacbioRunPlate.vue', () => {
  let plate, wrapper

  beforeEach(() => {
    const run = new Response(Data.PacbioRun).deserialize.runs[0]

    // smrt link versions are retrieved by PacbioRunShow view
    // smrt_link_version_id is set on the currentRun by newRun and editRun actions
    run.smrt_link_version_id = run.pacbio_smrt_link_version_id
    const smrtLinkVersions = {
      1: { id: 1, name: 'v11', default: true },
    }
    store.commit('traction/pacbio/runCreate/populateRun', run)
    store.state.traction.pacbio.runCreate.resources.smrtLinkVersions = smrtLinkVersions

    wrapper = mount(PacbioRunPlate, {
      localVue,
      store,
    })
    plate = wrapper.vm
  })

  it('will be defined', () => {
    expect(plate).toBeDefined()
  })

  it('has the correct number of wells', () => {
    const wells = wrapper.findAll('[data-attribute="pacbio-run-well"]')
    expect(wells.length).toEqual(96)
  })
})
