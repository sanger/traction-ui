import Samples from '@/views/pacbio/PacbioSamples'
import { mount, localVue, Vuex, Data } from '../../testHelper'
import Alert from '@/components/Alert'
import PrinterModal from '@/components/PrinterModal'
import * as consts from '@/consts/consts'
import VueRouter from 'vue-router'
import Response from '@/api/Response'

describe('Samples.vue', () => {
    let wrapper, samples, mockSamples

    beforeEach(() => {
        mockSamples = [
            { id: 1, barcode: 'TRAC-8', material: { id: 6, type: 'requests', library_type: 'type', estimate_of_gb_required: 100, number_of_smrt_cells: 3, sample_name: 'a name1', created_at: '03/12/2019 11:49' } },
            { id: 2, barcode: 'TRAC-8', material: { id: 6, type: 'requests', library_type: 'type', estimate_of_gb_required: 100, number_of_smrt_cells: 3, sample_name: 'a name2', created_at: '03/12/2019 11:49' } }
        ]

        const router = new VueRouter({
            routes: [{
                path: '/pacbio/samples',
                name: 'PacbioSamples',
                component: Samples,
                props: true
            }]
        })

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
                                        tractionTubes: mockSamples
                                    },
                                    getters: {
                                        tractionTubesWithInfo: state => state.tractionTubes.map(i => Object.assign(i.material, { barcode: i.barcode }))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        wrapper = mount(Samples, {
            store,
            router,
            localVue,
            stubs: {
                Alert: Alert,
                PrinterModal: true
            },
            methods: {
                provider() { return }
            }
        })
        samples = wrapper.vm
    })

    describe('building the table', () => {
        it('contains the correct fields', () => {
            let headers = wrapper.findAll('th')
            for (let field of samples.fields) {
                expect(headers.filter(header => header.text() === field.label)).toBeDefined()
            }
        })

        it('contains the correct data', async () => {
            let mockSamples = new Response(Data.TractionPacbioSamples).deserialize.requests
            wrapper.setData({ items: mockSamples })
            expect(wrapper.find('tbody').findAll('tr').length).toEqual(5)
        })
    })

    describe('#showAlert', () => {
        it('passes the message to function on emit event', () => {
            samples.showAlert('show this message', 'danger')
            expect(wrapper.find(Alert).html()).toMatch('show this message')
        })
    })

    describe('printerModal', () => {
        beforeEach(() => {
            samples.handlePrintLabel = jest.fn()
        })

        it('passes selected printer to function on emit event', () => {
            samples.selected = [{ id: 1 }]
            let modal = wrapper.find(PrinterModal)
            modal.vm.$emit('selectPrinter', 'printer1')

            expect(samples.handlePrintLabel).toBeCalledWith('printer1')
        })
    })

    describe('alert', () => {
        it('has a alert', () => {
            expect(wrapper.contains(Alert)).toBe(true)
        })
    })
})
