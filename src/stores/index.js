import Api from '@/api'
import build from '@/api/ApiBuilder'
import PrinterList from '@/config/PrinterList'
import PlateMap from '@/config/PlateMap'
import { defineStore } from 'pinia'

const useRootStore = defineStore('root', {
  state: () => ({
    api: build({ config: Api.Config, environment: import.meta.env }),
    printers: PrinterList,
    plateMap: PlateMap,
  }),
  getters: {
    printerNames: (state) => state.printers.map((obj) => obj.printerName),
  },
})

export default useRootStore
