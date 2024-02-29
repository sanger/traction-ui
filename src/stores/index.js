import config from '@/api/Config'
import build from '@/api/ApiBuilder'
import PrinterList from '@/config/PrinterList'
import PlateMap from '@/config/PlateMap'
import { defineStore } from 'pinia'
import { handleResponse } from '@/api/ResponseHelper.js'
import { groupIncludedByResource, dataToObjectById } from '@/api/JsonApi.js'

export const errorFor = ({ lines, records }, message) =>
  `Library ${records} on line ${lines}: ${message}`

const useRootStore = defineStore('root', {
  state: () => ({
    //Build an API instance using the config
    api: build({ config }),

    //Create printers state from PrinterList.json file
    printers: PrinterList,
    //Get plateMap state from the PlateMap.json file
    plateMap: PlateMap,

    /*Messages to be printed to the user in the front end
     * The messages are stored in an object with a unique id as the key
     * and the message as the value
     */
    messages: {},
  }),
  getters: {
    //Get the printer names from the printers
    printerNames: (state) => state.printers.map((obj) => obj.printerName),
  },
  actions: {
    /**
     * Asynchronously sets tractionTags in store using tags fetched from service (/traction/tags).
     *
     * @async
     * @returns {Promise<Object>} An object containing the success status and any errors.
     */
    async setTags() {
      const request = this.api.traction.tags
      const promise = request.get()
      const {
        success,
        data: { data, included = [] },
        errors,
      } = await handleResponse(promise)

      if (success && data) {
        const { tags } = groupIncludedByResource(included)
        this.tractionTags = dataToObjectById({ data: tags })
      }
      return { success, errors }
    },

    /**
     * Adds a message to the store with a unique id as the key which is the last message id + 1
     * @param {*} message The message to be added
     */
    addMessage(message) {
      //Remove the last message and return its id
      const messageId = Object.keys(this.messages).pop() ?? 0
      this.messages[messageId + 1] = message
    },
    /**
     * Removes a message from the store by its index
     * @param {*} messageIndex index of the message to be removed
     */
    removeMessage(messageIndex) {
      delete this.messages[messageIndex]
    },

    /**
     * Clears all messages
     */
    clearMessages() {
      this.messages = {}
    },

    /**
     * Adds a CSV log message with the given information, error, and type.
     * The type defaults to 'danger' if not provided.
     * The message is generated by calling `errorFor` with the provided information and error.
     * The message is added with root set to true.
     *
     * @param {string} info - The information for the message.
     * @param {string} error - The error for the message.
     * @param {string} [type='danger'] - The type of the message (optional, defaults to 'danger').
     *
     * @example
     * // Add a CSV message
     * addCSVMessage('info123', 'error123');
     */
    addCSVLogMessage(info, error, type = 'danger') {
      this.addMessage({ type, message: errorFor(info, error) }, { root: true })
    },
  },
})

export default useRootStore
