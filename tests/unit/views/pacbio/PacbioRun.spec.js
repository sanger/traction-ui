import PacbioRun from '@/views/pacbio/PacbioRun'
import { mount, localVue, Vuex } from '../../testHelper'
import VueRouter from 'vue-router'
import Alert from '@/components/Alert'
import PacbioRunInfo from '@/components/PacbioRunInfo'
import PacbioLibrariesTable from '@/components/PacbioLibrariesTable'
import Plate from '@/components/Plate'

describe('Run.vue', () => {

    let wrapper, mockRun, pacbioRun, router, store

    beforeEach(() => {
        router = new VueRouter({
            routes: [
                { path: '/runs', name: 'PacbioRuns', component: require('@/views/pacbio/PacbioRuns') },
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
            uuid: '',
            system_name: '',
            plate: {
                barcode: '',
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

        wrapper = mount(PacbioRun, { localVue, store, router })
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
            expect(wrapper.contains(PacbioLibrariesTable)).toBe(true)
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

    // describe('update button', () => {
    //     it('will only show if the record is new', () => {
    //         expect(wrapper.find('#update').exists()).toBeTruthy()
    //     })
    // })

    // describe('create button', () => {

    //     it('will only show if the record is new', () => {
    //         expect(wrapper.find('#create').exists()).toBeFalsy()
    //     })
    // })

    // describe('update button', () => {
    //     it('will only show if the record is new', () => {
    //         expect(wrapper.find('#update').exists()).toBeTruthy()
    //     })
    // })

    // describe('#create', () => {

    //     beforeEach(() => {
    //         saphyrRun.showAlert = jest.fn()
    //         saphyrRun.createRun = jest.fn()
    //         saphyrRun.redirectToRuns = jest.fn()
    //     })

    //     it('calls createRun', async () => {
    //         await saphyrRun.create()
    //         expect(saphyrRun.createRun).toBeCalled()
    //     })

    //     it('successful', async () => {
    //         await saphyrRun.create()
    //         expect(saphyrRun.createRun).toBeCalled()
    //         expect(saphyrRun.redirectToRuns).toBeCalled()
    //     })

    //     it('unsuccessful', async () => {
    //         saphyrRun.createRun.mockImplementation(() => {
    //             throw Error('Raise this error')
    //         })
    //         await saphyrRun.create()
    //         expect(saphyrRun.createRun).toBeCalled()
    //         expect(saphyrRun.showAlert).toBeCalled()
    //         expect(saphyrRun.redirectToRuns).not.toBeCalled()
    //     })
    // })

    // describe('#update', () => {

    //     beforeEach(() => {
    //         saphyrRun.showAlert = jest.fn()
    //         saphyrRun.updateRun = jest.fn()
    //         saphyrRun.redirectToRuns = jest.fn()
    //     })

    //     it('calls updateRun', async () => {
    //         await saphyrRun.update()
    //         expect(saphyrRun.updateRun).toBeCalled()
    //         expect(saphyrRun.redirectToRuns).toBeCalled()
    //     })

    //     it('successful', async () => {
    //         await saphyrRun.update()
    //         expect(saphyrRun.updateRun).toBeCalled()
    //         expect(saphyrRun.redirectToRuns).toBeCalled()
    //     })

    //     it('unsuccessful', async () => {
    //         saphyrRun.updateRun.mockImplementation(() => {
    //             throw Error('Raise this error')
    //         })
    //         await saphyrRun.update()
    //         expect(saphyrRun.updateRun).toBeCalled()
    //         expect(saphyrRun.showAlert).toBeCalled()
    //         expect(saphyrRun.redirectToRuns).not.toBeCalled()
    //     })
    // })

    describe('#showAlert', () => {
        it('emits an event with the message', () => {
            pacbioRun.showAlert('show this message', 'success')
            expect(wrapper.find(Alert).text()).toMatch(/show this message/)
        })
    })

})
