import OntRunLibrariesList from '@/components/ont/OntRunLibrariesList'
import { localVue, mount } from 'testHelper'

describe('OntLibraries.vue', () => {
  let wrapper, librariesData, props, librariesList, query, mutate

  beforeEach(() => {
    props = {
      selectedLibraryNames: [],
    }
    librariesData = [
      { id: 1, name: 'TRAC-2-1', assignedToFlowcell: true },
      { id: 2, name: 'TRAC-2-2', assignedToFlowcell: false },
      { id: 3, name: 'TRAC-2-3', assignedToFlowcell: false },
      { id: 4, name: 'TRAC-2-4', assignedToFlowcell: false },
      { id: 5, name: 'TRAC-2-5', assignedToFlowcell: true },
    ]

    query = jest.fn()
    mutate = jest.fn()

    // create the mock of the method before mounting it for testing
    jest.spyOn(OntRunLibrariesList.methods, 'provider').mockImplementation(() => {})

    wrapper = mount(OntRunLibrariesList, {
      localVue,
      propsData: props,
      data() {
        return {
          libraries: librariesData,
        }
      },
      mocks: {
        $apollo: {
          mutate: mutate,
          query: query,
        },
      },
    })

    librariesList = wrapper.vm
  })

  it('will have a table', () => {
    expect(wrapper.find('.ont-run-libraries')).toBeDefined()
  })

  describe('#unselectedLibraries', () => {
    let expectedUnselectedLibraries

    beforeEach(() => {
      expectedUnselectedLibraries = librariesList.libraries.filter(
        (library) => !library.assignedToFlowcell,
      )
    })
    it('returns libraries that are no assigned to flowcells', () => {
      expect(librariesList.unselectedLibraries).toEqual(expectedUnselectedLibraries)
    })
    it('contains the correct data', () => {
      expect(
        wrapper.find('.ont-run-libraries-list-group').findAll('.list-group-item').length,
      ).toEqual(expectedUnselectedLibraries.length)
    })
  })

  describe('components', () => {
    it('has a OntTube component', () => {
      expect(wrapper.findComponent({ ref: 'ontTube' })).toBeTruthy()
    })
  })

  describe('#drop', () => {
    let mockEvent, flowcellPosition, libraryName

    beforeEach(() => {
      libraryName = 'TRAC-1'
      flowcellPosition = 1

      let getData = jest
        .fn()
        .mockImplementationOnce(() => flowcellPosition)
        .mockImplementation(() => libraryName)

      mockEvent = {
        dataTransfer: {
          getData() {
            return getData()
          },
        },
        preventDefault: jest.fn(),
      }

      librariesList.updateFlowcell = jest.fn()
      librariesList.updateLibraryList = jest.fn()
    })

    it('will call updateFlowcell', () => {
      librariesList.drop(mockEvent)
      expect(librariesList.updateFlowcell).toBeCalledWith(flowcellPosition, '')
    })

    it('will call updateLibraryList', () => {
      librariesList.drop(mockEvent)
      expect(librariesList.updateLibraryList).toBeCalledWith(libraryName, false)
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
      let libraries = { nodes: [{ id: 1 }] }
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
