import Vue from 'vue'
import Api from '@/api'

// params 'api' - an Api.Config resource
// return an object with key of api resource, and value of a Request for the resource
const buildRequest = (api) => {
  let configItemCmp = Vue.extend(Api.ConfigItem)
  let config =  new configItemCmp({ propsData: api})

  let requestObject = {}

  Object.keys(config.resources).forEach(key => {
    let requestCmp = Vue.extend(Api.Request)
    let request =  new requestCmp({ propsData: config.resource(key)})
    requestObject[key] = request
  })

  return requestObject
}

export default buildRequest
