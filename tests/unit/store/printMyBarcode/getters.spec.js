import getters from '@/store/printMyBarcode/getters'

describe('getters', () => {
  it('"sampleExtractionTubeRequest" returns "rootState.api.sampleExtraction.assets"', () => {
    const rootState = {
      api: {
        sampleExtraction: {
          assets: 'aRequestURL',
        },
      },
    }
    expect(getters.sampleExtractionTubeRequest({}, {}, rootState)).toBe('aRequestURL')
  })

  it('"printJobV2Request" returns "rootState.api.printMyBarcodeV2.print_jobs"', () => {
    const rootState = {
      api: {
        printMyBarcodeV2: {
          print_jobs: 'aPrintJobsRequestURL',
        },
      },
    }
    expect(getters.printJobV2Request({}, {}, rootState)).toBe('aPrintJobsRequestURL')
  })

  it('"squixLabelTemplateName" returns "state.squixLabelTemplateName"', () => {
    const state = {
      squixLabelTemplateName: 'aSquixLabelTemplateName',
    }
    expect(getters.squixLabelTemplateName(state)).toBe(state.squixLabelTemplateName)
  })

  it('"toshibaLabelTemplateName" returns "state.toshibaLabelTemplateName"', () => {
    const state = {
      toshibaLabelTemplateName: 'atoshibaLabelTemplateName',
    }
    expect(getters.toshibaLabelTemplateName(state)).toBe(state.toshibaLabelTemplateName)
  })
})
