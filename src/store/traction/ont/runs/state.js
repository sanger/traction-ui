import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout'

const state = {
  runs: [],
  currentRun: {
    id: 'new',
    instrument_name: '',
    state: '',
    flowcell_attributes: [],
  },
  instrumentFlowcellLayout: InstrumentFlowcellLayout,
  instruments: [],
}

export default state
