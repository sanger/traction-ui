import { mount, localVue, Vuex } from '../testHelper'
import PacbioLibrariesTable from '@/components/PacbioLibrariesTable'
import StoreLibraries from '../../data/StoreLibraries'

describe('PacbioLibrariesTable', () => {

    let wrapper, librariesTable, libraries

    beforeEach(() => {
        libraries = StoreLibraries

        let store = new Vuex.Store({
            modules: {
                traction: {
                    namespaced: true,
                    modules: {
                        pacbio: {
                            namespaced: true,
                            modules: {
                                tubes: {
                                    namespaced: true,
                                    state: {
                                        libraries: libraries
                                    },
                                    getters: {
                                        libraries: state => state.libraries,
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

    it('contains the correct data', () => {
        expect(wrapper.find('tbody').findAll('tr').length).toEqual(5)
    })

})
