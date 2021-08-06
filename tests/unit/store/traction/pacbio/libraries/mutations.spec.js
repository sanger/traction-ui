import Response from '@/api/Response'
import { Data } from 'testHelper'
import mutations from '@/store/traction/pacbio/libraries/mutations'

let library, libraries, state

describe('mutations', () => {
  beforeEach(() => {
    library = new Response(Data.TractionPacbioLibrary).deserialize.libraries[0]
    libraries = new Response(Data.TractionPacbioLibraries).deserialize.libraries
  })

  it('"setLibraries" sets "state.libraries" to the given libraries', () => {
    state = {
      libraries: [],
    }
    mutations.setLibraries(state, libraries)
    expect(state.libraries).toEqual(libraries)
  })

  it('"updateLibrary" updates "state.libraries" with the given library change', () => {
    library.volume = 7
    state.libraries = libraries
    mutations.updateLibrary(state, library)
    libraries = new Response(Data.TractionPacbioLibraries).deserialize.libraries
    //need to recall libraries here due to libraries automatically becoming state.libraries
    expect(state.libraries).not.toEqual(libraries)
  })
})
