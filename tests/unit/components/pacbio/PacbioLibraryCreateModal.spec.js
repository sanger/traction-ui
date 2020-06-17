import { mount, localVue, store, Data } from '../../testHelper'
import PacbioLibraryCreateModal from '@/components/pacbio/PacbioLibraryCreateModal'
import Response from '@/api/Response'
import * as consts from '@/consts/consts'

describe('PacbioLibraryCreateModal.vue', () => {

    let wrapper, modal, props

    beforeEach(() => {
        props = {
            disabled: true,
            isStatic: true,
            selectedSamples: [1]
        }

        wrapper = mount(PacbioLibraryCreateModal, {
            localVue,
            store,
            propsData: props,
            // methods: {
            //     provider() { return }
            // }
        })
        modal = wrapper.vm
    })

    it('will have an button component', () => {
        expect(wrapper.find('#pacbioLibraryCreateModal').element).toBeTruthy()
    })

    it('will have an modal component', () => {
        expect(wrapper.find('#pacbioLibraryModal').element).toBeTruthy()
    })

    it('will have an form component', () => {
        expect(wrapper.find('#libraryCreateModal').element).toBeTruthy()
    })

    it('must have a disabled prop', () => {
        expect(modal.disabled).toEqual(props.disabled)
    })

    it('must have a isStatic prop', () => {
        expect(modal.isStatic).toEqual(props.isStatic)
    })

    it('must have a selectedSamples prop', () => {
        expect(modal.selectedSamples).toEqual(props.selectedSamples)
    })

    it('must have tagOptions data', () => {
        expect(modal.tagOptions).toEqual([])
    })

    describe('#createLibrary', () => {
        let payload

        beforeEach(() => {
            modal.createLibraryInTraction = jest.fn()
            modal.showAlert = jest.fn()
            payload = { 'library': { tag: { group_id: 1}, samples: [1] } }
        })
        
        it('is successful', async () => {
            wrapper.setData({ library: { tag: { group_id: 1 } } } )
            let expectedResponse = new Response(Data.Libraries)
            modal.createLibraryInTraction.mockReturnValue(expectedResponse)

            await modal.createLibrary()

            expect(modal.createLibraryInTraction).toBeCalledWith(payload)
            expect(wrapper.emitted().alert).toBeTruthy()
        })

        it('shows a error message on when there isnt a tag', async () => {
            await modal.createLibrary()

            expect(modal.createLibraryInTraction).not.toBeCalledWith(payload)
            expect(modal.showAlert).toBeCalledWith(consts.MESSAGE_ERROR_CREATE_LIBRARY_FAILED + "Please select a tag", 'danger')
        })

        it('shows a error message on failure', async () => {
            wrapper.setData({ library: { tag: { group_id: 1 } } })

            let failedResponse = { status: 422, statusText: 'Unprocessable Entity', data: { errors: { it: ['did not work'] } } } 
            let expectedResponse = new Response(failedResponse)

            modal.createLibraryInTraction.mockReturnValue(expectedResponse)

            await modal.createLibrary()

            expect(modal.createLibraryInTraction).toBeCalledWith(payload)
            expect(modal.showAlert).toBeCalledWith(consts.MESSAGE_ERROR_CREATE_LIBRARY_FAILED + "it did not work", 'danger')
        })
    })
})