import ConfigItem from '@/api/ConfigItem'
import Vue from 'vue'

describe('API Config', () => {

  let apis, cmp

  beforeEach(() => {
     apis = { 
      "api1": {
        "name": "api1",
        "apiNamespace": "api/v1",
        "resources": {
          "resource1": {
            "name": "resource1",
            "filters": {
              "filter1": "foo",
              "filter2": "bar"
            },
            "include": "users"
          },
          "resource2": {}
        }
      },
      "api2": {
        "name": "api2",
        "apiNamespace": "v2",
        "resources": {
          "resource1": {},
          "resource2": {}
        }
      }

    }
  })

  describe('ConfigItem', () => {

    let configItem, api

    beforeEach(() => {
      process.env.VUE_APP_API1_BASE_URL = 'http://api1'
      api = apis.api1
      cmp = Vue.extend(ConfigItem)
      configItem = new cmp({ propsData:  api })
    })

    it('has a baseURL', () => {
      expect(configItem.baseURL).toEqual('http://api1')
    })

    it('has an api namespace', () => {
      expect(configItem.apiNamespace).toEqual(api.apiNamespace)
    })

    it('has some resources', () => {
      expect(configItem.resources).toEqual(api.resources)
    })

    it('can find a particular resource', () => {
      let resource = configItem.resource('resource1')
      expect(resource.baseURL).toEqual(process.env.VUE_APP_API1_BASE_URL)
      expect(resource.apiNamespace).toEqual(api.apiNamespace)
      expect(resource.resource).toEqual(api.resources.resource1.name)
      expect(resource.filters).toEqual(api.resources.resource1.filters)
    })

  })

})