import { mount, localVue, Vuex } from '../testHelper'
import PacbioLibrariesTable from '@/components/PacbioLibrariesTable'
import * as Run from '@/api/PacbioRun'

describe('PacbioLibrariesTable', () => {

    let wrapper, librariesTable, run

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

        wrapper = mount(PacbioLibrariesTable, { 
            localVue, 
            store,
            methods: {
                provider() { return }
            }
        })
        librariesTable = wrapper.vm
    })

    it('will have a name', () => {
        expect(wrapper.name()).toEqual('PacbioLibrariesTable')
    })

    it('will have a table', () => {
        expect(wrapper.find('.libraries-table')).toBeDefined()
    })

    it('contains the correct fields', () => {
        let headers = wrapper.findAll('th')
        for (let field of librariesTable.fields) {
            expect(headers.filter(header => header.text() === field.label)).toBeDefined()
        }
    })
})
