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

    describe('new run button', () => {

        it('contains a create new run button', () => {
            expect(wrapper.contains('button')).toBe(true)
        })

        it('will redirect to the run when newRun is clicked', async () => {
            runs.newRun = jest.fn()
            let button = wrapper.find('#newRun')
            button.trigger('click')
            expect(runs.newRun).toBeCalled()
        })
    })

    describe('start button', () => {
        let button

        it('is enabled when the run state is pending', () => {
            // run at(1) is in state pending
            button = wrapper.find('#startRun-1')
            expect(button.attributes('disabled')).toBeFalsy()
        })

        it('is disabled is the run state is started', () => {
            // run at(2) is in state started
            button = wrapper.find('#startRun-2')
            expect(button.attributes('disabled')).toBeTruthy()
        })

        it('is disabled is the run state is completed', () => {
            // run at(3) is in state started
            button = wrapper.find('#startRun-3')
            expect(button.attributes('disabled')).toBeTruthy()
        })

        it('is disabled is the run state is cancelled', () => {
            // run at(4) is in state started
            button = wrapper.find('#startRun-4')
            expect(button.attributes('disabled')).toBeTruthy()
        })

        it('on click startRun is called', () => {
            runs.startRun = jest.fn()

            button = wrapper.find('#startRun-1')
            button.trigger('click')
            expect(runs.startRun).toBeCalledWith(mockRuns[0].id)
        })
    })

    describe('complete button', () => {
        let button

        it('is is enabled when the run state is pending', () => {
            // run at(1) is in state pending
            button = wrapper.find('#completeRun-1')
            expect(button.attributes('disabled')).toBeTruthy()
        })

        it('is is enabled when the run state is started', () => {
            // run at(2) is in state started
            button = wrapper.find('#completeRun-2')
            expect(button.attributes('disabled')).toBeFalsy()
        })

        it('is disabled if the run state is completed', () => {
            // run at(3) is in state cancelled
            button = wrapper.find('#completeRun-3')
            expect(button.attributes('disabled')).toBeTruthy()
        })

        it('is disabled is the run state is cancelled', () => {
            // run at(4) is in state cancelled
            button = wrapper.find('#completeRun-4')
            expect(button.attributes('disabled')).toBeTruthy()
        })

        it('on click completeRun is called', () => {
            // run at(2) is in state started
            runs.completeRun = jest.fn()

            button = wrapper.find('#completeRun-2')
            button.trigger('click')

            expect(runs.completeRun).toBeCalledWith(mockRuns[1].id)
        })
    })

    describe('cancel button', () => {
        let button

        it('is is enabled when the run state is pending', () => {
            // run at(1) is in state pending
            button = wrapper.find('#cancelRun-1')
            expect(button.attributes('disabled')).toBeTruthy()
        })

        it('is is enabled when the run state is started', () => {
            // run at(2) is in state started
            button = wrapper.find('#cancelRun-2')
            expect(button.attributes('disabled')).toBeFalsy()
        })

        it('is disabled if the run state is completed', () => {
            // run at(3) is in state cancelled
            button = wrapper.find('#cancelRun-3')
            expect(button.attributes('disabled')).toBeTruthy()
        })

        it('is disabled is the run state is cancelled', () => {
            // run at(4) is in state cancelled
            button = wrapper.find('#cancelRun-4')
            expect(button.attributes('disabled')).toBeTruthy()
        })

        it('on click cancelRun is called', () => {
            // run at(2) is in state started
            runs.cancelRun = jest.fn()

            button = wrapper.find('#cancelRun-2')
            button.trigger('click')

            expect(runs.cancelRun).toBeCalledWith(mockRuns[1].id)
        })
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
})