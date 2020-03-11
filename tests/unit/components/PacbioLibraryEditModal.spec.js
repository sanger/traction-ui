import { mount, localVue, Vuex, Data } from '../testHelper'
import PacbioLibraryEditModal from '@/components/PacbioLibraryEditModal'

describe('PacbioLibraryEditModal.vue', () => {

  let wrapper, modal, props, mockLibrary

  beforeEach(() => {
    mockLibrary = { 
      id: 1, 
      type: 'libraries',
      state: 'pending',
      barcode: 'TRAC-1',
      volume: 1,
      concentration: 1,
      library_kit_barcode: 1,
      fragment_size: 1,
      created_at: "03/10/2020 08:00",
      deactivated_at: null,
      sample_names: "4616STDY7535900,4616STDY7535900",
      tag_oligos: "ATGC,CGTA",
      requests: {
        0: {
          type: "request_libraries",
          id: "6",
          sample_name: "Sample6",
          tag_oligo: "AGCT",
          tag_set_name: "Sequel_16_barcodes_v3",
          tag_id: "3"
        }
      } 
    },
    props = { lib: mockLibrary }

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
                    requests: mockLibrary
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
  

    wrapper = mount(PacbioLibraryEditModal, {
      localVue,
      store,
      propsData: props,
    }),

    modal = wrapper.vm
  }),

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('PacbioLibraryEditModal')
  })

  it('will have a modal', () => {
    expect(wrapper.find('#editLibraryModal')).toBeDefined()
  })

  it('will have a form', () => {
    expect(wrapper.find('#libraryMetaDataForm')).toBeDefined()
  })

  it('must have a library prop', () => {
    expect(modal.library).toEqual(props.lib)
  })
 


  describe('update', () => {
    beforeEach(() => {
      modal.alert = jest.fn()
      modal.hide = jest.fn()
      modal.updateLibrary = jest.fn()
    })

    it('successful ', async () => {
      modal.updateLibrary.mockReturnValue(true)
      await modal.update()
      expect(modal.alert).toBeCalledWith('Library updated', 'success')
      expect(modal.hide).toBeCalled()
    })

    it('unsuccessful ', async () => {
      modal.updateLibrary.mockImplementation(() => {
        throw Error('Raise this error')
      })
      await modal.update()
      expect(modal.alert).toBeCalledWith('Failed to update library. Error: Raise this error', 'danger')
      expect(modal.hide).toBeCalled()
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

})