import * as Mutations from '@/store/traction/pacbio/runs/mutations'
import * as Run from '@/api/PacbioRun'

describe.skip('#updateWell', () => {

  let run, payload, well, state

  beforeEach(() => {
    run = Run.build()
    state = {
      currentRun: run
    }
  })

  it('successfully', () => {
    payload = { 
      position: 'A1',
      movie_time: 20,
      insert_size: 30,
      on_plate_loading_concentration: 40,
      library: {
        id: 1,
        barcode: 'DN1234567'
      }
    }

    Mutations.default.updateWell(state, payload)

    well = state.currentRun.plate.wells.filter(well => well.position === 'A1')[0]

    expect(well.position).toEqual('A1')
    expect(well.movie_time).toEqual(20)
    expect(well.insert_size).toEqual(30)
    expect(well.on_plate_loading_concentration).toEqual(40)
    expect(well.library).toEqual({id: 1, barcode: 'DN1234567'})
  })
})
