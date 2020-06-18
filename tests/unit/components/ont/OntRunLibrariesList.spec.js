import OntRunLibrariesList from '@/components/ont/OntRunLibrariesList'
import OntTube from '@/components/ont/OntTube'
import { mount, localVue } from '../../testHelper'

describe('OntLibraries.vue', () => {
  let wrapper, librariesData, props, librariesList, query, mutate

  beforeEach(() => {
    props = {
      selectedLibraryNames: []
    }
    librariesData = [
      { id: 1, name: 'TRAC-2-1', plate_barcode: 'TRAC-1-1', poolSize: 1, wellRange: 'A1-H3', tag_set: 24 },
      { id: 2, name: 'TRAC-2-2', plate_barcode: 'TRAC-1-1', poolSize: 2, wellRange: 'A4-H6', tag_set: 24 },
      { id: 3, name: 'TRAC-2-3', plate_barcode: 'TRAC-1-1', poolSize: 3, wellRange: 'A7-H9', tag_set: 24 },
      { id: 4, name: 'TRAC-2-4', plate_barcode: 'TRAC-1-1', poolSize: 4, wellRange: 'A10-H12', tag_set: 24 },
      { id: 5, name: 'TRAC-2-5', plate_barcode: 'TRAC-1-2', poolSize: 1, wellRange: 'A1-H12', tag_set: 96 },
    ]

    query = jest.fn()
    mutate = jest.fn()

    wrapper = mount(OntRunLibrariesList, {
      localVue,
      propsData: props,
      data() {
        return {
          libraries: librariesData
        }
      },
      methods: {
        provider() { return }
      },
      mocks: {
        $apollo: {
          mutate: mutate,
          query: query
        }
      },
    })

    librariesList = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('OntRunLibrariesList')
  })

  it('will have a table', () => {
    expect(wrapper.find('.ont-run-libraries')).toBeDefined()
  })

  it('contains the correct data', () => {
    expect(wrapper.find('.ont-run-libraries-list-group').findAll('.list-group-item').length).toEqual(5)
  })

  describe('components', () => {
    it('has a OntTube component', () => {
      expect(wrapper.contains(OntTube)).toBe(true)
    })
  })

  describe('#drop', () => {
    let mockEvent, flowcellPosition //, libraryName

    beforeEach(() => {
      flowcellPosition = 1  
      mockEvent = { dataTransfer: { getData() { return flowcellPosition } }, preventDefault: jest.fn() }
      librariesList.handleDropUpdate = jest.fn()
    })

    it('will call handleDropUpdate', () => {
      librariesList.drop(mockEvent)
      // TODO: figure out how to return flowcellPosition and libraryName from getData()
      expect(librariesList.handleDropUpdate).toBeCalledWith(flowcellPosition, 1, false)
    })

    it('will show the image', () => {
      librariesList.drop(mockEvent)
      expect(librariesList.hover).toBeFalsy()
      expect(wrapper.find('img').exists()).toBeTruthy()
    })
  })

  describe('#fetchLibraries', () => {
    beforeEach(() => {
      librariesList.setClientLibraries = jest.fn()
    })

    it('calls LIBRARIES_ALL_QUERY query and setClientLibraries', async () => {
      let libraries = { nodes: [{ id: 1 }]}
      let mockResponse = { data: { libraries } } 

      const request = Promise.resolve(mockResponse)
      query.mockReturnValue(request)

      await librariesList.fetchLibraries()
      expect(librariesList.setClientLibraries).toBeCalledWith(libraries.nodes)
    })
  })

  describe('#setClientLibraries', () => {
    it('calls setClientLibraries to set the libraries in the cache', async () => {
      let libraries = [{ id: 1 }]

      await librariesList.setClientLibraries(libraries)
      expect(mutate).toBeCalled()
    })
  })

})