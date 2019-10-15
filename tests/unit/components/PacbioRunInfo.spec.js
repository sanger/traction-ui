import { mount, localVue, Vuex } from '../testHelper'
import PacbioRunInfo from '@/components/PacbioRunInfo'
import * as Run from '@/api/PacbioRun'

describe('PacbioRunInfo', () => {

    let wrapper, runInfo, run

    beforeEach(() => {
        run = Run.build()

        let store = new Vuex.Store({
            modules: {
                traction: {
                    namespaced: true,
                    modules: {
                        pacbio: {
                            namespaced: true,
                            modules: {
                                runs: {
                                    namespaced: true,
                                    state: {
                                        currentRun: run
                                    },
                                    getters: {
                                        currentRun: state => state.currentRun,
                                    },
                                }
                            }

                        }
                    }
                }
            }
        })

        wrapper = mount(PacbioRunInfo, { localVue, store })
        runInfo = wrapper.vm
    })

    it('will have a name', () => {
        expect(wrapper.name()).toEqual('PacbioRunInfo')
    })

    it('can have mapState', () => {
        expect(runInfo.runName).toBeDefined()
        expect(runInfo.templatePrepKitBoxBarcode).toBeDefined()
        expect(runInfo.bindingKitBoxBarcode).toBeDefined()
        expect(runInfo.sequencingKitBoxBarcode).toBeDefined()
        expect(runInfo.dnaControlComplexBoxBarcode).toBeDefined()
        expect(runInfo.comments).toBeDefined()
        expect(runInfo.uuid).toBeDefined()
        expect(runInfo.systemName).toBeDefined()
    })

    it('can have getters', () => {
        expect(runInfo.currentRun).toBeDefined()
    })
})
