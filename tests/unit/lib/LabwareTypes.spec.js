import { LabwareTypes } from '@/lib/LabwareTypes'

describe('LabwareTypes', () => {
  describe('plate96', () => {
    it('contains correct properties', () => {
      const plate96 = LabwareTypes.Plate96
      expect(plate96.name).toEqual('96-well plate')
      expect(plate96.numRows).toEqual(8)
      expect(plate96.numColumns).toEqual(12)
      expect(plate96.layoutType).toEqual('byCol')
    })

    it('uses alphanumeric positionFormat function', () => {
      const plate96 = LabwareTypes.Plate96
      expect(plate96.positionFormat(1, 1)).toEqual('A1')
      expect(plate96.positionFormat(8, 12)).toEqual('H12')
      expect(plate96.positionFormat(27, 5)).toEqual('27,5')
    })
  })

  describe('multiPool96', () => {
    it('contains correct properties', () => {
      const multiPool96 = LabwareTypes.MultiPool96
      expect(multiPool96.name).toEqual('96-well multi pool')
      expect(multiPool96.numRows).toEqual(8)
      expect(multiPool96.numColumns).toEqual(12)
      expect(multiPool96.layoutType).toEqual('byCol')
    })

    it('uses numeric positionFormat function', () => {
      const multiPool96 = LabwareTypes.MultiPool96
      expect(multiPool96.positionFormat(1, 1, multiPool96.numRows)).toEqual('1')
      expect(multiPool96.positionFormat(8, 12, multiPool96.numRows)).toEqual('96')
      expect(multiPool96.positionFormat(5, 3, multiPool96.numRows)).toEqual('21')
    })
  })

  describe('plate4', () => {
    it('contains correct properties', () => {
      const plate4 = LabwareTypes.Plate4
      expect(plate4.name).toEqual('4-well plate')
      expect(plate4.numRows).toEqual(4)
      expect(plate4.numColumns).toEqual(1)
      expect(plate4.layoutType).toEqual('byCol')
    })

    it('uses alphanumeric positionFormat function', () => {
      const plate4 = LabwareTypes.Plate4
      expect(plate4.positionFormat(1, 1)).toEqual('A1')
      expect(plate4.positionFormat(4, 1)).toEqual('D1')
    })
  })
})
