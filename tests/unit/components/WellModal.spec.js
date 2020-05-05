import { mount, localVue, Vuex } from '../testHelper'
import WellModal from '@/components/WellModal'
import * as Run from '@/api/PacbioRun'
import Response from '@/api/Response'
import { Data } from '../testHelper'
import pacbioRunModule from '../../../src/store/traction/pacbio/runs'

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
                                        currentRun: run,
                                        well: { libraries: [ { barcode: 'TRAC-0'}]}
                                    },
                                    getters: pacbioRunModule.getters
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
        expect(modal.movieTimeOptions).toEqual([{ text: 'Movie Time', value: "" }, "15.0", "20.0", "24.0", "30.0"])
    })

    it('must have sequencingMode data', () => {
        expect(modal.sequencingModeOptions).toEqual([{ text: 'Sequencing Mode', value: "" }, 'CLR', 'CCS'])
    })

    it('can have mapState', () => {
        expect(modal.insertSize).toBeDefined()
        expect(modal.onPlateLoadingConc).toBeDefined()
        expect(modal.movieTime).toBeDefined()
        expect(modal.wellLibraries).toBeDefined()
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
        it('has a table of well libraries', () => {
            expect(wrapper.find('#wellLibraries')).toBeDefined()
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
        beforeEach(() => {
            modal.mutateWell = jest.fn()
        })

        it('updateInsertSize', () => {
            modal.updateInsertSize(123)
            expect(modal.mutateWell).toBeCalledWith({ position: props.position, property: 'insert_size', with: 123})
        })

        it('updateOnPlateLoadingConc', () => {
            modal.updateOnPlateLoadingConc(123)
            expect(modal.mutateWell).toBeCalledWith({ position: props.position, property: 'on_plate_loading_concentration', with: 123 })
        })

        it('updateMovieTime', () => {
            modal.updateMovieTime(123)
            expect(modal.mutateWell).toBeCalledWith({ position: props.position, property: 'movie_time', with: 123 })
        })

        it('updateSequencingMode', () => {
            modal.updateSequencingMode('CLR')
            expect(modal.mutateWell).toBeCalledWith({ position: props.position, property: 'sequencing_mode', with: 'CLR' })
        })

        describe('updateLibraryBarcode', () => {
            let newBarcode, row, anIndex

            beforeEach(() => {
                newBarcode = 'TRAC-1'
                anIndex = 1
                row = { index: anIndex}
                modal.showAlert = jest.fn()
                modal.isLibraryBarcodeValid = jest.fn()
                modal.getTubeForBarcode = jest.fn()
                modal.addLibraryToWell = jest.fn()
            })

            it('successful when barcode is valid', async () => {
                let tube = new Response(Data.TractionTubeWithContainerMaterials).deserialize.tubes[0]
                let library = tube.materials[0]

                modal.isLibraryBarcodeValid.mockReturnValue(true)
                modal.getTubeForBarcode.mockReturnValue(tube)

                await modal.updateLibraryBarcode(row, newBarcode)

                expect(modal.addLibraryToWell).toBeCalledWith({ index: anIndex, position: props.position, with: { id: library.id, barcode: library.barcode } })
                expect(modal.showAlert).toBeCalledWith('Library is valid', 'success')
            })

            it('is unsuccessful when barcode is not valid', async () => {
                modal.isLibraryBarcodeValid.mockReturnValue(false)

                await modal.updateLibraryBarcode(newBarcode)
                expect(modal.addLibraryToWell).not.toBeCalled()
                expect(modal.showAlert).toBeCalledWith('Library is not valid', 'danger')
            })

        })
    })

})
