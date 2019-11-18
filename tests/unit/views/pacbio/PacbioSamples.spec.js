import Samples from '@/views/pacbio/PacbioSamples'
import { mount, localVue, Vuex, Data } from '../../testHelper'
import Alert from '@/components/Alert'
import PrinterModal from '@/components/PrinterModal'
import VueRouter from 'vue-router'
import Response from '@/api/Response'
import LibraryCreatePacbioModal from '@/components/LibraryCreatePacbioModal'

describe('Samples.vue', () => {
    let wrapper, samples, mockSamples

    beforeEach(() => {
        mockSamples = new Response(Data.TractionPacbioSamples).deserialize.requests

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
                                requests: {
                                    namespaced: true,
                                    state: {
                                        requests: mockSamples
                                    },
                                    getters: {
                                        requests: state => state.requests
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
                PrinterModal: true,
                LibraryCreatePacbioModal: true
            },
            methods: {
                provider() { return }
            }
        })

        wrapper.setData({ items: mockSamples })
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

    describe('Edit button', () => {
        let button

        it('is present for each sample', () => {
            button = wrapper.find('#editRun-1')
            expect(button.text()).toEqual('Edit')
        })
    })
})
