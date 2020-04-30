import { Data } from '../testHelper'

// mutation {
//   createPlateWithOntSamples(
//       input: {
//           arguments: {
//               barcode: "PLATE-122"
//               wells: [
//                   {
//                       position: "A1"
//                       sample: {
//                           name: "Sample for A3"
//                           externalId: "f9756f0b-3df0-46d6-8314-af50fa6c4427"
//                       }
//                   }
//                   {
//                       position: "D7"
//                       sample: {
//                           name: "Sample for D7"
//                           externalId: "28ba6d65-4943-4ca4-b830-ea23d4e3cc05"
//                       }
//                   }
//                   {
//                       position: "F11"
//                       sample: {
//                           name: "Sample for F11"
//                           externalId: "70df9f72-d727-424c-bfae-dbb79ff19ce0"
//                       }
//                   }
//               ]
//           }
//       }
//   ) {
//       plate {
//           id
//           barcode
//           wells {
//               plateId
//           }
//       }
//       errors
//   }
// }


describe('createPlateWithOntSamples.vue', () => {

  let plates

  beforeEach(() => {
    plates = Data.SequencescapePlates
  })

  it('works', () => {
    expect(true).toBeTruthy()
    expect(plates).toBeDefined()
  })

})