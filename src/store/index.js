import Vuex from 'vuex'
import Vue from 'vue'
import Api from '@/api'
import build from '@/api/ApiBuilder'
import PrinterList from '@/config/PrinterList'
import traction from '@/store/traction'
import sampleExtraction from '@/store/sampleExtraction'
import printMyBarcode from '@/store/printMyBarcode'
import SuffixList from '@/config/SuffixList'
import PlateMap from '@/config/PlateMap'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api: build({ config: Api.Config, environment: process.env }),
    printers: PrinterList,
    plateMap: PlateMap,
    suffixes: SuffixList,
  },
  mutations: {},
  getters: {
    api: (state) => state.api,
    printers: (state) => state.printers.map((obj) => obj.printerName),
    printersWithType: (state) => state.printers,
    plateMap: (state) => state.plateMap,
    suffixes: (state) => state.suffixes,
  },
  modules: {
    traction,
    sampleExtraction,
    printMyBarcode,
  },
})
