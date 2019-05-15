import Vue from 'vue'
import { mount } from '../testHelper'
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

    it('each flowcell will have a position', () => {
      let flowcells = run.chip.flowcells
      expect(flowcells[0].position).toEqual(1)
      expect(flowcells[1].position).toEqual(2)
    })

  })

  describe('validate', () => {

    beforeEach(() => {
      run = Run.build()
    })
    
    describe('chip', () => {

      it('will raise an error if the barcode is not present', () => {
        expect(Run.validate(run).chip).toEqual("barcode not present")
      }) 

      it('will raise an error if the barcode is not in the correct format', () => {
        run.chip['barcode'] = 'XYZ1234'
        expect(Run.validate(run).chip).toEqual("barcode not in correct format")
      })
    })

    describe('flowcell', () => {

      it('will raise an error if the library is not present', () => {

      })

      it('will raise an error if the library is not valid', () => {

      })
    })
  })
})
