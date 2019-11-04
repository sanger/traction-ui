import { mount, localVue, Vuex } from '../testHelper'
import WellModal from '@/components/WellModal'
import * as Run from '@/api/PacbioRun'
import Response from '@/api/Response'
import libraryTube from '../../data/pacbioTubeWithLibrary'

describe('PacbioRunInfo', () => {

    let wrapper, modal, run, props

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

        props = { position: 'A1' }

        wrapper = mount(WellModal, { localVue, store, propsData: props })
        modal = wrapper.vm
    })

    it('will have a name', () => {
        expect(wrapper.name()).toEqual('WellModal')
    })

    it('must have a position prop', () => {
        expect(modal.position).toEqual(props.position)
    })

    it('must have movieTimeOptions data', () => {
        expect(modal.movieTimeOptions).toEqual([{ text: 'Movie Time', value: "" }, 15, 20, 30])
    })

    it('must have sequencingMode data', () => {
        expect(modal.sequencingModeOptions).toEqual([{ text: 'Sequencing Mode', value: "" }, 'CLR', 'CCS'])
    })

    it('can have mapState', () => {
        expect(modal.insertSize).toBeDefined()
        expect(modal.onPlateLoadingConc).toBeDefined()
        expect(modal.movieTime).toBeDefined()
        expect(modal.libraryBarcode).toBeDefined()
        expect(modal.sequencingMode).toBeDefined()
    })

    it('can have getters', () => {
        expect(modal.currentRun).toBeDefined()
    })

    describe('form inputs', () => {
        it('has a Library Barcode input', () => {
            expect(wrapper.find('.libraryBarcode')).toBeDefined()
        })
        it('has a Movie Time input', () => {
            expect(wrapper.find('.movieTime')).toBeDefined()
        })
        it('has a On Plate Loading Concentration input', () => {
            expect(wrapper.find('.onPlateLoadingConc')).toBeDefined()
        })
        it('has a Insert Size input', () => {
            expect(wrapper.find('.insertSize')).toBeDefined()
        })
        it('has a Sequencing Mode input', () => {
            expect(wrapper.find('.sequencingMode')).toBeDefined()
        })
    })

    describe('alert', () => {
        it('emits an event with the message', () => {
            modal.alert('emit this message', 'success')
            expect(wrapper.emitted().alert).toBeTruthy()
            expect(wrapper.emitted().alert[0][0]).toEqual('emit this message')
            expect(wrapper.emitted().alert[0][1]).toEqual('success')
        })
    })

    describe('methods', () => {
        it('updateInsertSize', () => {
            modal.setInsertSize = jest.fn()
            modal.updateInsertSize(123)
            expect(modal.setInsertSize).toBeCalledWith({insertSize: 123, position: props.position})
        })

        it('updateOnPlateLoadingConc', () => {
            modal.setOnPlateLoadingConc = jest.fn()
            modal.updateOnPlateLoadingConc(123)
            expect(modal.setOnPlateLoadingConc).toBeCalledWith({ onPlateLoadingConc: 123, position: props.position })
        })

        it('updateMovieTime', () => {
            modal.setMovieTime = jest.fn()
            modal.updateMovieTime(123)
            expect(modal.setMovieTime).toBeCalledWith({ movieTime: 123, position: props.position })
        })

        it('updateSequencingMode', () => {
            modal.setSequencingMode = jest.fn()
            modal.updateSequencingMode('CLR')
            expect(modal.setSequencingMode).toBeCalledWith({ sequencingMode: 'CLR', position: props.position })
        })

        describe('updateLibraryBarcode', () => {
            let newBarcode

            beforeEach(() => {
                newBarcode = 'TRAC-1'
                modal.showAlert = jest.fn()
                modal.isLibraryBarcodeValid = jest.fn()
                modal.getTubeForBarcode = jest.fn()
                modal.setLibraryBarcode = jest.fn()
            })

            it('successful when barcode is valid', async () => {
                let successfulResponse = new Response(libraryTube)
                let tube = successfulResponse.deserialize.tubes[0]

                modal.isLibraryBarcodeValid.mockReturnValue(true)
                modal.getTubeForBarcode.mockReturnValue(tube)

                await modal.updateLibraryBarcode(newBarcode)

                expect(modal.setLibraryBarcode).toBeCalled()
                expect(modal.showAlert).not.toBeCalled()
            })

            it('is unsuccessful when barcode is not valid', async () => {
                modal.isLibraryBarcodeValid.mockReturnValue(false)

                await modal.updateLibraryBarcode(newBarcode)
                expect(modal.setLibraryBarcode).not.toBeCalled()
                expect(modal.showAlert).toBeCalledWith('Library is not valid', 'danger')
            })

        })
    })
})
