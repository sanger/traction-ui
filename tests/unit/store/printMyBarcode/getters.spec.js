import getters from '@/store/printMyBarcode/getters'

describe('getters', () => {
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

  it('"tubeLabelTemplateName" returns "state.tubeLabelTemplateName"', () => {
    const state = {
      tubeLabelTemplateName: 'atubeLabelTemplateName',
    }
    expect(getters.tubeLabelTemplateName(state)).toBe(state.tubeLabelTemplateName)
  })
})
