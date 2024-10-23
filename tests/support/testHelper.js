// Useful imports for testing
import { mount, shallowMount, flushPromises, config } from '@vue/test-utils'

/*createPinia is for creating a Pinia instance to test pinia stores.
setActivePinia sets the newly created Pinia instance as the active Pinia instance.
This is necessary to allow useStore to pick up the any other pinia instance other than default global instance
More documentation available on https://pinia.vuejs.org/cookbook/testing.html*/
import { setActivePinia, createPinia } from 'pinia'

//createTestingPinia is to mock a Pinia store while testing a component that uses Pinia store.
import { createTestingPinia } from '@pinia/testing'

import store from '@/store'
import Data from '@tests/data/'
import router from '@/router'
import { nextTick } from 'vue'
import globalAlert from '@/mixins/globalAlert'
import { components } from '@/components/shared'

/*
    This setups up a global config for all tests that use these methods
    Doing this here instead of in setup.js means we don't set global config for all tests
    This is useful for tests that don't use these methods and run in different environments
    e.g. tests/unit/lib/csv/pacbio.spec.js
*/
config.global.mixins = [globalAlert]
config.global.plugins = [router, store]
config.global.components = components

/* Helper functions to simplify tests */
const findAllByText = (wrapper, text) => {
  /*
  Find all elements with the given text.
   */
  return wrapper.findAll('*').filter((node) => node.text() === text)
}
const findByText = (wrapper, text) => {
  /*
  Find the first element that has the given text.
  https://github.com/vuejs/vue-test-utils/issues/960#issuecomment-1146631607
   */
  const results = findAllByText(wrapper, text)
  if (results.length === 0) {
    throw new Error(`findByText() found no element with the text: "${text}".`)
  }
  return results.at(0)
}

/**
 *
 * @param {String} statusCode - status code of the response. Should be in the 200 range.
 * @param {Object} data - data to be returned in the response
 * @param {Array} included - included data to be returned in the response
 * @returns {Object} - a successful response object (fetch)
 * A standard response object that can be used to mock a successful fetch response.
 */
const successfulResponse = ({ statusCode = 201, data = {}, included = [] } = {}) => {
  return {
    status: statusCode,
    statusText: 'OK',
    json: () =>
      Promise.resolve({
        data,
        included,
      }),
    ok: true,
  }
}

/**
 *
 * @param {String} statusCode - status code of the response. Should be in the 400 or 500 range.
 * @returns {Object} - a failed response object (fetch)
 * A standard response object that can be used to mock a failed fetch response.
 */
const failedResponse = (statusCode = 500) => {
  const statusTypes = {
    422: { status: 422, statusText: 'Unprocessable Entity' },
    500: { status: 500, statusText: 'Internal Server Error' },
  }
  return {
    ...statusTypes[statusCode],
    json: () =>
      Promise.resolve({
        errors: [{ title: 'error1', detail: 'There was an error.' }],
      }),
    ok: false,
    errorSummary: 'error1 There was an error.',
  }
}

export {
  mount,
  store,
  Data,
  shallowMount,
  router,
  flushPromises,
  nextTick,
  setActivePinia,
  createPinia,
  createTestingPinia,
  findAllByText,
  findByText,
  successfulResponse,
  failedResponse,
}
