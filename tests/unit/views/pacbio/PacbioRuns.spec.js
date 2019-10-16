import PacbioRuns from '@/views/pacbio/PacbioRuns'
import { mount, localVue, Vuex, Data } from '../../testHelper'
import Response from '@/api/Response'
import Alert from '@/components/Alert'

describe('Runs.vue', () => {

    let wrapper, runs, mockRuns, store

    beforeEach(() => {
        mockRuns = new Response(Data.PacbioRuns).deserialize.runs

        store = new Vuex.Store({
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
                                        runs: mockRuns
                                    },
                                    getters: {
                                        runs: state => state.runs,
                                    },
                                    actions: {
                                        setRuns: jest.fn()
                                    }
                                }
                            }

                        }
                    }
                }
            }
        })

        wrapper = mount(PacbioRuns, { store, localVue, methods: { provider() { return } } })
        runs = wrapper.vm
    })

    describe('created hook', () => {
        it('sets the runs data', () => {
            expect(runs.runs).toEqual(mockRuns)
        })
    })

    describe('alert', () => {
        it('has a alert', () => {
            expect(wrapper.contains(Alert)).toBe(true)
        })
    })

    it('contains a table', () => {
        expect(wrapper.contains('table')).toBe(true)
    })

    describe('sorting', () => {
        it('will sort the runs by created at', () => {
            expect(wrapper.find('tbody').findAll('tr').at(0).text()).toMatch(/Sequel II/)
        })
    })

    describe('filtering runs', () => {
        beforeEach(() => {
            wrapper = mount(PacbioRuns, {
                store,
                localVue,
                methods: {
                    provider() {
                        return
                    }
                },
                data() {
                    return {
                        filter: mockRuns[0].name
                    }
                }
            })
        })

        it('will filter the runs in the table', () => {
            expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
            expect(wrapper.find('tbody').findAll('tr').at(0).text()).toMatch(/Sequel I/)
        })
    })

    describe('#showAlert', () => {
        it('emits an event with the message', () => {
            runs.showAlert(/show this message/)
            expect(wrapper.find(Alert).text()).toMatch(/show this message/)
        })
    })

    describe('pagination', () => {
        beforeEach(() => {
            wrapper = mount(PacbioRuns, {
                store,
                localVue,
                methods: {
                    provider() {
                        return
                    }
                },
                data() {
                    return {
                        perPage: 2,
                        currentPage: 1
                    }
                }
            })
        })

        it('will paginate the runs in the table', () => {
            expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
        })

    })

    describe('#provider', () => {
        beforeEach(() => {
            wrapper = mount(PacbioRuns, { store, localVue })
            runs = wrapper.vm

            runs.setRuns = jest.fn()
            runs.showAlert = jest.fn()
        })

        it('calls setRuns successfully', () => {
            runs.provider()
            expect(runs.setRuns).toBeCalled()
        })

        it('calls setRuns unsuccessfully', () => {
            runs.setRuns.mockImplementation(() => {
                throw Error('Raise this error')
            })
            runs.provider()
            expect(runs.showAlert).toBeCalled()
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
            expect(link.attributes("href")).toBe(process.env.VUE_APP_TRACTION_BASE_URL + "/v1/pacbio/runs/" + id + "/sample_sheet")
        })
    })
})