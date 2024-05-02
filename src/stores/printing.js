import { defineStore } from 'pinia'

export const usePrintingStore = defineStore('printing', {
  state: () => ({
    printers: [],
  }),
})
