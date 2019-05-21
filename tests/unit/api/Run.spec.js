import Vue from 'vue'
import { mount } from '../testHelper'
import Request from '@/api/Request'
import LibraryTubeJson from '../../data/tubeWithLibrary'
import SampleTubeJson from '../../data/tractionTubesWithSample'
import Response from '@/api/Response'
import * as Run from '@/api/Run'

describe('Run', () => {

  let run

  describe('build', () => {

    beforeEach(() => {
      run = Run.build()
    })

    it('will have an empty chip', () => {
      expect(run.chip).toBeDefined()
    })

    it('will have two flowcells', () => {
      expect(run.chip.flowcells.length).toEqual(2)
    })

    it('each flowcell will have a library', () => {
      expect(run.chip.flowcells[0].library).toBeDefined()
    })

    it('each flowcell will have a position', () => {
      let flowcells = run.chip.flowcells
      expect(flowcells[0].position).toEqual(1)
      expect(flowcells[1].position).toEqual(2)
    })

  })

  describe('creating a run', () => {

    let cmp, props, wrapper, request, mockResponse, response, failedResponse, chipBarcode, barcode1, barcode2

    beforeEach(() => {
      cmp = Vue.extend({
        mixins: [Request],
        render () { return ''}
      })

      props = { baseURL: 'http://sequencescape.com',
                apiNamespace: 'api/v2',
                resource: 'requests' }
      wrapper = mount(cmp, { propsData: props })

      request = wrapper.vm.api
      request.get = jest.fn()

      failedResponse = { status: 404, statusText: 'Record not found', data: { errors: { title: ['The record identified by 100 could not be found.'] }} }

      chipBarcode = 'XYZ1234567891012'
      barcode1 = 'DN123'
      barcode2 = 'DN234'
    })

    describe('getLibrary', () => {
      it('when it returns a library', async () => {
        mockResponse = new Response(LibraryTubeJson).deserialize.tubes[0].material
        request.get.mockResolvedValue(LibraryTubeJson)
        response = await Run.getLibrary('DN123', request)
        expect(response).toEqual(mockResponse)
      })

      it('when it returns a sample', async () => {
        request.get.mockResolvedValue(SampleTubeJson)
        response = await Run.getLibrary('DN123', request)
        expect(response).not.toBeDefined()
      })

      it('when it returns nothing', async() => {
        request.get.mockResolvedValue(failedResponse)
        response = await Run.getLibrary('DN123', request)
        expect(response).not.toBeDefined()
      })
    })

    describe('validate', () => {
      let result

      beforeEach(() => {
        run = Run.build()
      })

      describe('chip', () => {

        it('will raise an error if the barcode is not present', async () => {
          result = await Run.validate(run)
          expect(result.chip).toEqual("barcode not present")
        }) 

        it('will raise an error if the barcode is not in the correct format', async () => {
          run.chip['barcode'] = 'XYZ1234'
          result = await Run.validate(run)
          expect(result.chip).toEqual("barcode not in correct format")
        })
      })

      describe('flowcell', () => {

        beforeEach(() => {
          run.chip['barcode'] = chipBarcode
          run.chip.flowcells[0].library.barcode = barcode1
        })

        it('will raise an error if the library is not present', async () => {
          mockResponse = new Response(LibraryTubeJson).deserialize.tubes[0].material
          request.get.mockResolvedValue(LibraryTubeJson)
          result = await Run.validate(run, request)
          expect(result.flowcells['2']).toEqual('library not present')
        })

        it('will raise an error if the library does not exist', async () => {
          request.get.mockResolvedValue(failedResponse)
          result = await Run.validate(run, request)
          expect(result.flowcells['1']).toEqual('library does not exist')

          request.get.mockResolvedValue(SampleTubeJson)
          result = await Run.validate(run, request)
          expect(result.flowcells['1']).toEqual('library does not exist')
        })
      })
    })

    describe('create', () => {

      describe('success', () => {

        beforeEach(() => {
          run = Run.build()
          run['name'] = 'run1'
          run.chip['barcode'] = chipBarcode
          run.chip.flowcells[0].barcode = barcode1
          run.chip.flowcells[1].barcode = barcode2
          request.post = jest.fn()
        })

        it('will create a run', () => {
          mockResponse = 

        })

        it('will create a chip', () => {

        })

        it('will create some flowcells', () => {

        })
      })

      describe('when the run is invalid', () => {
        it('will not create a run', () => {

        })
      })

      describe('if any call is unsuccessful', () => {

        it('will generate an error message', () => {

        })

        it('will rollback', () => {

        })
      })
    })
  })
})
