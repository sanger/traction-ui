import { createQcResultsUploadResource } from '@/services/traction/QcResultsUpload'

describe('QcResultsUpload', () => {
  describe('#createQcResultsUploadResource', () => {
    // Setup some of the parameters we'll be testing with
    let csv = `,,SAMPLE INFORMATION,,,,,,,,,,,,,VOUCHERING,,,,EXTRACTION/QC,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,COLUMN JUST FOR TOL,COLUMN JUST FOR TOL,SE LIMS,
      Batch ,Tissue Tube ID,Sanger sample ID,Species,Genome Size,Tissue FluidX rack ID,Rack well location,Date,Crush Method,Tissue Mass (mg),Tissue type,Lysis ,DNA tube ID,DNAext FluidX Rack ID,Rack position,Voucher?,Voucher Tube ID,Voucher Rack ID,Sample Location,Qubit DNA Quant (ng/ul) [ESP1],DNA vol (ul),DNA total ng [ESP1],Femto dilution [ESP1],ND 260/280 [ESP1],ND 260/230 [ESP1],ND Quant (ng/ul) [ESP1],Femto Frag Size [ESP1],GQN >30000 [ESP1],Femto pdf [ESP1],LR EXTRACTION DECISION [ESP1],Sample Well Position in Plate,TOL DECISION [ESP1],DNA Fluid+ MR kit for viscous DNA?,MR Machine ID,MR speed,Vol Input DNA MR3 (uL),Save 1uL post shear,Vol Input SPRI (uL),SPRI volume (x0.6),Qubit Quant (ng/ul) [ESP2],Final Elution Volume (ul),Total DNA ng [ESP2],Femto Dil (ul) [ESP2],ND 260/280 [ESP2],ND 260/230 [ESP2],ND Quant (ng/uL) [ESP2],% DNA Recovery,Femto Fragment size [ESP2],GQN 10kb threshold [ESP2],Femto pdf [ESP2],LR SHEARING DECISION [ESP2],TOL DECISION [ESP2],ToL ID ,Genome size (TOL),SE Number,Date in PB Lab (Auto)
      Production 1,FD20709764,DTOL12932860,,0.53,,,04/05/2022,Powermash,7.8,Non-plant,2h@25C,,,NA,Yes,FD38542652,SA00930879,A1,4.78,385,1840.3,18.12,2.38,0.57,14.9,22688,1.5,Extraction.Femto.9764-9765,Pass,,,,Alan Shearer/Britney Shears,30,,FALSE,,,22.6,45.4,1026.04,89.4,1.92,1.79,33.7,55.8,9772,4.4,Sheared.Femto.9764-6843,Pass,,idCheUrba1,0.52725,SE293337P,24/06/2022
      Production 17,FS41960467,DTOL13024296,,1.11,,,25/07/2022,Cryoprep,74.4,Plant,1h@55C,FD32230265,fk00223822,D12,Yes,FD3852457,SA01034046,H1,1.64,380,623.2,5.56,1.76,1.26,1.76,36616,2.5,2022 07 25 15H 57M,Pass,,Proceed to shear and spri,,Ed Sheeran,30,355,FALSE,325,195,7.46,45,335.7,28.84,1.58,0.96,11.76,53.9,17817,8.2,2022 10 20 12H 06M,On Hold ULI,,ddAndPoli5,1.11492,,`

    const usedBySelected = 'extraction'

    const createdReceptionResponse = {
      status: 201,
      statusText: 'Created',
      data: {
        id: '69',
        type: 'qc_results_uploads',
        links: {
          self: 'http://localhost:3100/v1/qc_results_uploads/69',
        },
        attributes: {
          csv_data: csv,
          used_by: usedBySelected,
        },
      },
    }

    const createQcResultsUploadRequest = vi.fn()

    it('successfully', async () => {
      createQcResultsUploadRequest.mockResolvedValue(createdReceptionResponse)

      const response = await createQcResultsUploadResource(createQcResultsUploadRequest, {
        csv,
        usedBySelected,
      })

      expect(response).toEqual(createdReceptionResponse.data)
    })

    it('generates a valid payload', async () => {
      createQcResultsUploadRequest.mockResolvedValue(createdReceptionResponse)

      await createQcResultsUploadResource(createQcResultsUploadRequest, { csv, usedBySelected })

      expect(createQcResultsUploadRequest).toHaveBeenCalledWith({
        data: {
          data: {
            type: 'qc_results_uploads',
            attributes: {
              csv_data: csv,
              used_by: usedBySelected,
            },
          },
        },
      })
    })

    // Error response currently thrown - to fix in Service
    // {
    //   "errors":[
    //      {
    //         "title":"Internal Server Error",
    //         "detail":"Internal Server Error",
    //         "code":"500",
    //         "status":"500",
    //         "meta":{
    //            "exception":"New line must be \u003c\"\\r\\n\"\u003e not \u003c\"\\r\"\u003e in line 9.",
    //            "backtrace":[],
    //            "application_backtrace":[]
    //         }
    //      }
    //   ]
    // }

    // {
    //   "errors":[
    //      {
    //         "title":"Internal Server Error",
    //         "detail":"Internal Server Error",
    //         "code":"500",
    //         "status":"500",
    //         "meta":{
    //            "exception":"Validation failed: Labware barcode can't be blank",
    //            "backtrace":[],
    //            "application_backtrace":[]
    //         }
    //      }
    //   ]
    // }
    it('when the QcResultsUpload could not be created', async () => {
      const failedResponse = {
        status: 422,
        statusText: 'Record not found',
        data: {
          errors: [{ title: 'error1', detail: 'There was an error.' }],
        },
      }

      createQcResultsUploadRequest.mockRejectedValue({ response: failedResponse })

      expect(
        createQcResultsUploadResource(createQcResultsUploadRequest, { csv, usedBySelected }),
      ).rejects.toThrow('error1 There was an error.')
    })
  })
})
