import { setActivePinia, createPinia } from 'pinia'
import { usePacbioTubesStore } from '../../../src/stores/pacbioTubes'
import { Data } from '@support/testHelper'
import Response from '@/api/Response'

//Test cases for usePacbioTubesStore

describe('usePacbioTubesStore', () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  //Test initial state of the store
  it('should have an empty tractionTubes array', () => {
    const store = usePacbioTubesStore()
    expect(store.tractionTubes).toEqual([])
  })

  //Test the isLibraryBarcodeValid action
  it('should return false when barcode is null', async () => {
    const store = usePacbioTubesStore()
    const result = await store.isLibraryBarcodeValid('')
    expect(result).toEqual(false)
  })

  //Test the isLibraryBarcodeValid action
  it('should return false if there is no pool', async () => {
    const store = usePacbioTubesStore()
    const sampleTube = new Response(Data.TractionTubesWithPacbioPools).deserialize.tubes[0]
    store.getTubeForBarcode = vi.fn().mockReturnValue(sampleTube)
    const result = await store.isLibraryBarcodeValid('TRAC-1')
    expect(result).toEqual(false)
  })

  //Test the isLibraryBarcodeValid action
  it('should return false if the pool is not ready', async () => {
    const store = usePacbioTubesStore()
    const sampleTube = new Response(Data.TractionTubesWithPacbioPools).deserialize.tubes[1]
    store.getTubeForBarcode = vi.fn().mockReturnValue(sampleTube)
    const result = await store.isLibraryBarcodeValid('TRAC-2')
    expect(result).toEqual(false)
  })

  //Test the isLibraryBarcodeValid action
  it('should return true if the pool is ready', async () => {
    const store = usePacbioTubesStore()
    const libraryTube = new Response(Data.TractionTubesWithPacbioPools).deserialize.tubes[2]
    store.getTubeForBarcode = vi.fn().mockReturnValue(libraryTube)
    const result = await store.isLibraryBarcodeValid('TRAC-3')
    expect(result).toEqual(true)
  })

  //Test the getTubeForBarcode action
  it('should return a tube for a given barcode', async () => {
    const store = usePacbioTubesStore()
    store.tubeRequest.get = vi.fn().mockReturnValue(Data.TractionTubeWithContainerMaterials)
    const barcode = 'TRAC-1'
    const expectedResponse = new Response(Data.TractionTubeWithContainerMaterials)
    const response = await store.getTubeForBarcode(barcode)

    expect(response).toEqual(expectedResponse.deserialize.tubes[0])
  })
  it('should return an empty array if the barcode is not found', async () => {
    const store = usePacbioTubesStore()
    const barcode = 'TRAC-1'
    store.tubeRequest.get = vi.fn().mockReturnValue({
      data: { data: [] },
      status: 500,
      statusText: 'Internal Server Error',
    })
    const response = await store.getTubeForBarcode(barcode)
    expect(response).toEqual()
  })

  //Test the validateLibraryTube action
  it('should return false if there no tube exists', async () => {
    const store = usePacbioTubesStore()
    expect(store.validateLibraryTube()).toBeFalsy()
  })
  it("should return false if there tube doesn't have pools", async () => {
    const store = usePacbioTubesStore()
    expect(store.validateLibraryTube({ 'no pools': '' })).toBeFalsy()
  })
  it('returns false if the pool is not complete', () => {
    const store = usePacbioTubesStore()
    expect(store.validateLibraryTube({ pools: [{}] })).toBeFalsy()
  })

  it('returns true if valid', () => {
    const store = usePacbioTubesStore()
    // check the validation of a library
    expect(
      store.validateLibraryTube({
        pools: [
          {
            volume: 100,
            concentration: 200,
            template_prep_kit_box_barcode: 'barcode',
            insert_size: 122,
          },
        ],
      }),
    ).toBeTruthy()
  })

  it('updates value in store when tubes are modified', () => {
    const store = usePacbioTubesStore()
    expect(store.tractionTubes).toEqual([])
    const tubes = [{ id: 1 }, { id: 2 }]
    store.tractionTubes = tubes
    expect(store.tractionTubes).toEqual(tubes)
  })
})
