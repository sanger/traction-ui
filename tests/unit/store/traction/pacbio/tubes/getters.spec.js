import Response from '@/api/Response'
import { Data } from '../../../../testHelper'
import getters from '@/store/traction/pacbio/tubes/getters'

let libraries

describe('getters', () => {
    beforeEach(() => {
        libraries = new Response(Data.TractionPacbioLibraries).deserialize.libraries
    })

    it('"libraries" returns libraries from "state.libraries"', () => {
        const state = {
            libraries: libraries
        }
        const actual = getters.libraries(state)
        expect(actual).toEqual(libraries)
    })
})