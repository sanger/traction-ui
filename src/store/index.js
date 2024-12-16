/**
 * # The Vuex store
 *
 * The store centralises application state and the ways in which it can be
 * interacted with. For more details on vuex see https://vuex.vuejs.org
 *
 * In brief though it is made up of 4 major components:
 *
 * state: A js object charged with persisting the state
 *
 * getters: Methods that provide access to the state, they are a bit like
 * computed properties on vue components. Getters are a great place to aggregate
 * and translate information
 *
 * mutations: Charges with updating the state. They provide an additional degree
 * of tracking over updating the state directly, and help maintain reactivity.
 *
 * actions: Unlike mutations, actions can be asynchronous, so are a great place
 * for API actions. They can also aggregate several mutations together, so are
 * perfect for handling more complicated activities. Generally I've found its
 * best to keep mutations dirt simple and highly re-usable, and actions can then
 * combine these together into more bespoke behaviours. (Even if they aren't
 * asynchronous)
 *
 * ## Some patterns that have worked well
 *
 * We originally attempted to deserialize objects into a deeply nested structure
 * prior to persisting them in the store. However, this results in a few issues:
 *
 * 1- You can easily end up with cyclical relationships, which causes Vue to get
 * into an infinite loop when setting up its reactivity.
 * 2- It reduces reusability, as objects in the store have a view enforced upon
 * them.
 *
 * Instead it is better to store the raw json-api-resource object in the store,
 * and reconstitute any relationships in the getters. We have a few helper
 * methods to achieve this over in @/api/JsonApi
 *
 * ## Does this mean I should avoid local state?
 *
 * Not at all, although be careful to avoid duplicating any state that is stored
 * globally. However things like toggling various interface elements are still a
 * great use of local state.
 *
 * It can also improve component reusability if components are decoupled from
 * the store. For example, a drop-down to select library type might still use a
 * prop and an emitted event, allowing it to be bound to different values in
 * different contexts.
 *
 * ## Namespacing
 *
 * Historically we made use of separate namespaces for each view, however this
 * was probably a mistake. It results in lots of duplication of resources across
 * different views, and different actions, mutations and getters for each.
 * Instead it would make more sense for resources to be fairly centralized under
 * their corresponding pipeline store, resulting in much more reuse. view
 * specific options, or specialized getters and actions, can still be properly
 * namespaced.
 */

import { createStore } from 'vuex'
import config from '@/api/Config'
import build from '@/api/ApiBuilder'
import traction from '@/store/traction'
import PlateMap from '@/config/PlateMap'

const store = createStore({
  state: {
    api: build({ config }),
    plateMap: PlateMap,
  },
  mutations: {},
  getters: {
    api: (state) => state.api,
    plateMap: (state) => state.plateMap,
  },
  modules: {
    traction,
  },
})

export default store
