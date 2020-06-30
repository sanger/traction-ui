import PacbioRun from '@/views/pacbio/PacbioRun'    
import PacbioRuns from '@/views/pacbio/PacbioRuns'
import { shallowMount, localVue, Vuex } from '../../testHelper'
import VueRouter from 'vue-router'
import Alert from '@/components/Alert'
import PacbioRunInfo from '@/components/pacbio/PacbioRunInfo'
import PacbioLibrariesList from '@/components/pacbio/PacbioLibrariesList'
import Plate from '@/components/pacbio/PacbioPlate'

describe('Run.vue', () => {

    let wrapper, mockRun, router, store, pacbioRun

    beforeEach(() => {
        router = new VueRouter({
            routes: [
                { path: '/run/:id', name: 'PacbioRun', component: PacbioRun },
                { path: '/runs', name: 'PacbioRuns', component: PacbioRuns },
            ]
        })

        mockRun = {
            id: '1',
            name: '',
            template_prep_kit_box_barcode: '',
            binding_kit_box_barcode: '',
            sequencing_kit_box_barcode: '',
            dna_control_complex_box_barcode: '',
            comments: '',
            system_name: '',
            plate: {
                wells: [
                    { position: 'A1', library: { barcode: '' } },
                    { position: 'A2', library: { barcode: '' } },
                    { position: 'B1', library: { barcode: '' } },
                    { position: 'B2', library: { barcode: '' } },
                ]
            }
        }
        
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
                                        currentRun: mockRun,
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

        wrapper = shallowMount(PacbioRun, {
            store, 
            router,
            localVue,
            methods: {
               provider() { return }
            }
        })
        pacbioRun = wrapper.vm
    })  

    it('will have a name', () => {
        expect(wrapper.name()).toEqual('Run')
    })

    describe('Alert', () => {
        it('has a alert', () => {
            expect(wrapper.contains(Alert)).toBe(true)
        })
    })

    describe('Pacbio Run Info', () => {
        it('dispays the run infomation', () => {
            expect(wrapper.contains(PacbioRunInfo)).toBe(true)        
        })
    })

    describe('Pacbio Libraries Table', () => {
        it('dispays the pacbio library table', () => {
            expect(wrapper.contains(PacbioLibrariesList)).toBe(true)
        })
    })

    describe('PacbioPlate', () => {
        it('dispays the pacbio run plate', () => {
            expect(wrapper.contains(Plate)).toBe(true)
        })
    })

    describe('Back button', () => {
        it('will always show', () => {
            expect(wrapper.find('#backToRunsButton').exists()).toBeTruthy()
        })
    })

    describe('button', () => {
        describe('Create button', () => {
            it('will only show if the record is new', () => {
                wrapper.setData({ newRecord: true })
                expect(wrapper.find('#create').exists()).toBeTruthy()
            })
        })

        describe('Update button', () => {
            it('will only show if the record is existing', () => {
                wrapper.setData({ newRecord: false })
                expect(wrapper.find('#update').exists()).toBeTruthy()
            })
        })

        describe('Reset button', () => {
            it('will only show if the record is new', () => {
                wrapper.setData({ newRecord: true })
                expect(wrapper.find('#reset').exists()).toBeTruthy()
            })
        })
    })

    describe('#create', () => {

        beforeEach(() => {
            pacbioRun.showAlert = jest.fn()
            pacbioRun.createRun = jest.fn()
            pacbioRun.redirectToRuns = jest.fn()
        })

        it('calls createRun', async () => {
            pacbioRun.createRun.mockReturnValue([])

            await pacbioRun.runAction()
            expect(pacbioRun.createRun).toBeCalled()
        })

        it('successful', async () => {
            pacbioRun.createRun.mockReturnValue([])

            await pacbioRun.runAction()
            expect(pacbioRun.createRun).toBeCalled()
            expect(pacbioRun.redirectToRuns).toBeCalled()
        })

        it('unsuccessful', async () => {
            pacbioRun.createRun.mockReturnValue(['this is an error'])

            await pacbioRun.runAction()
            expect(pacbioRun.createRun).toBeCalled()
            expect(pacbioRun.showAlert).toBeCalledWith("Failed to create run in Traction: this is an error", 'danger')
            expect(pacbioRun.redirectToRuns).not.toBeCalled()
        })
    })

    describe('#update', () => {

        beforeEach(() => {
             wrapper = shallowMount(PacbioRun, {
            store, 
            router,
            localVue,
            propsData: { id: 1},
            methods: {
               provider() { return }
               
            }
        })
        pacbioRun = wrapper.vm

            pacbioRun.showAlert = jest.fn()
            pacbioRun.updateRun = jest.fn()
            pacbioRun.redirectToRuns = jest.fn()
        })

        it('calls updateRun', async () => {
            pacbioRun.updateRun.mockReturnValue([])

            await pacbioRun.runAction()
            expect(pacbioRun.updateRun).toBeCalled()
        })

        it('successful', async () => {
            pacbioRun.updateRun.mockReturnValue([])

            await pacbioRun.runAction()
            expect(pacbioRun.updateRun).toBeCalled()
            expect(pacbioRun.redirectToRuns).toBeCalled()
        })

        it('unsuccessful', async () => {
            pacbioRun.updateRun.mockReturnValue(['this is an error'])

            await pacbioRun.runAction()
            expect(pacbioRun.updateRun).toBeCalled()
            expect(pacbioRun.showAlert).toBeCalledWith("Failed to create run in Traction: this is an error", 'danger')
            expect(pacbioRun.redirectToRuns).not.toBeCalled()
        })
    })

    describe('#reset', () => {

        beforeEach(() => {
            pacbioRun.showAlert = jest.fn()
            pacbioRun.newRun = jest.fn()
        })

        it('calls newRun', async () => {
            pacbioRun.newRun.mockReturnValue([])
            pacbioRun.resetRun()
            expect(pacbioRun.newRun).toBeCalled()
        })
    })
})
