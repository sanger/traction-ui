import { mount, localVue, store } from '../../testHelper'
import PacbioLibraryCreateModal from '@/components/pacbio/PacbioLibraryCreateModal'

describe('PacbioLibraryCreateModal.vue', () => {

    let wrapper, modal, props

    beforeEach(() => {
        props = {
            disabled: true,
            isStatic: true,
            selectedSamples: []
        }


        wrapper = mount(PacbioLibraryCreateModal, {
            localVue,
            store,
            propsData: props,
            methods: {
                provider() { return }
            }
        })
        modal = wrapper.vm
    })

    it('will have a name', () => {
        expect(wrapper.name()).toEqual('PacbioLibraryCreateModal')
    })

    it('will have an button component', () => {
        expect(wrapper.contains('#pacbioLibraryCreateModal')).toBe(true)
    })

    it('will have an modal component', () => {
        expect(wrapper.contains('#pacbioLibraryModal')).toBe(true)
    })

    it('will have an form component', () => {
        expect(wrapper.contains('#libraryCreateModal')).toBe(true)
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
})
