import Vue from 'vue'
import Api from '@/api'

const buildComponent = (component, props) => {
  let cmp = Vue.extend(component)
  return new cmp({ propsData: props})
}

// api - an Api.Config resource
// return - an object with api resource key, and resource Request value

const buildRequestHelper = (api) => {
  let config = buildComponent(Api.ConfigItem, api)

  let requestObject = {}

  Object.keys(config.resources).forEach(key => {
    let request = buildComponent(Api.Request, config.resource(key))
    requestObject[key] = request
  })

  return requestObject
}

export {
  buildComponent,
  buildRequestHelper
}

export default buildRequestHelper
