import Response from '@/api/Response'
import { Data } from 'testHelper'
import getters from '@/store/traction/pacbio/libraries/getters'

let libraries

describe('getters', () => {
  beforeEach(() => {
    libraries = new Response(Data.TractionPacbioLibraries).deserialize.libraries
  })

  it('"libraries" returns libraries from "state.libraries"', () => {
    const state = {
      libraries: libraries,
    }
    const actual = getters.libraries(state)
    expect(actual).toEqual(libraries)
  })

  it('"libraryByBarcode" returns the library with the specified barcode from "state.libraries"', () => {
    const state = {
      libraries: libraries,
    }
    const actual = getters.libraryByBarcode(state)(libraries[0].tube.barcode)
    expect(actual).toEqual(libraries[0])
  })
})
