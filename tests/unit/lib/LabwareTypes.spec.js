import { LabwareTypes } from '@/lib/LabwareTypes'

describe('LabwareTypes', () => {
  describe('plate96', () => {
    it('contains correct properties', () => {
      const plate96 = LabwareTypes.Plate96
      expect(plate96.name).toEqual('96-well plate')
      expect(plate96.numRows).toEqual(8)
      expect(plate96.numColumns).toEqual(12)
      expect(plate96.walkingDirection).toEqual('byColumn')
    })

    it('uses alphanumeric positionFormat function', () => {
      const plate96 = LabwareTypes.Plate96
      expect(plate96.positionFormat({ primaryIndex: 1, secondaryIndex: 1 })).toEqual('A1')
      expect(plate96.positionFormat({ primaryIndex: 8, secondaryIndex: 12 })).toEqual('H12')
      expect(plate96.positionFormat({ primaryIndex: 27, secondaryIndex: 5 })).toEqual('27,5')
    })
  })

  describe('multiPool96', () => {
    it('contains correct properties', () => {
      const multiPool96 = LabwareTypes.MultiPool96
      expect(multiPool96.name).toEqual('96-well multi pool')
      expect(multiPool96.numRows).toEqual(8)
      expect(multiPool96.numColumns).toEqual(12)
      expect(multiPool96.walkingDirection).toEqual('byColumn')
    })

    it('uses numeric positionFormat function', () => {
      const multiPool96 = LabwareTypes.MultiPool96
      expect(
        multiPool96.positionFormat({
          primaryIndex: 1,
          secondaryIndex: 1,
          walkingDistance: multiPool96.numRows,
        }),
      ).toEqual('1')
      expect(
        multiPool96.positionFormat({
          primaryIndex: 8,
          secondaryIndex: 12,
          walkingDistance: multiPool96.numRows,
        }),
      ).toEqual('96')
      expect(
        multiPool96.positionFormat({
          primaryIndex: 5,
          secondaryIndex: 3,
          walkingDistance: multiPool96.numRows,
        }),
      ).toEqual('21')
    })
  })

  describe('plate4', () => {
    it('contains correct properties', () => {
      const plate4 = LabwareTypes.Plate4
      expect(plate4.name).toEqual('4-well plate')
      expect(plate4.numRows).toEqual(4)
      expect(plate4.numColumns).toEqual(1)
      expect(plate4.walkingDirection).toEqual('byColumn')
    })

    it('uses alphanumeric positionFormat function', () => {
      const plate4 = LabwareTypes.Plate4
      expect(plate4.positionFormat({ primaryIndex: 1, secondaryIndex: 1 })).toEqual('A1')
      expect(plate4.positionFormat({ primaryIndex: 4, secondaryIndex: 1 })).toEqual('D1')
    })
  })
})
