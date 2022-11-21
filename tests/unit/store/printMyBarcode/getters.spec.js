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

  it('"printJobRequest" returns "rootState.api.printMyBarcode.print_jobs"', () => {
    const rootState = {
      api: {
        printMyBarcode: {
          print_jobs: 'aPrintJobsRequestURL',
        },
      },
    }
    expect(getters.printJobRequest({}, {}, rootState)).toBe('aPrintJobsRequestURL')
  })

  it('"tubeLabelTemplateName" returns "state.tubeLabelTemplateName"', () => {
    const state = {
      tubeLabelTemplateName: 'atubeLabelTemplateName',
    }
    expect(getters.tubeLabelTemplateName(state)).toBe(state.tubeLabelTemplateName)
  })
})
