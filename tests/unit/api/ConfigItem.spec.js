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
            "filter": {
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

    describe('props', () => {
      it('has a name', () => {
        expect(configItem.name).toEqual(api.name)
      })

      it('has an api namespace', () => {
        expect(configItem.apiNamespace).toEqual(api.apiNamespace)
      })

      it('has some resources', () => {
        expect(configItem.resources).toEqual(api.resources)
      })
    })

    it('#baseURL', () => {
      expect(configItem.baseURL).toEqual('http://api1')
    })

    it('#resource', () => {
      let resource = configItem.resource('resource1')
      expect(resource.baseURL).toEqual(process.env.VUE_APP_API1_BASE_URL)
      expect(resource.apiNamespace).toEqual(api.apiNamespace)
      expect(resource.resource).toEqual(api.resources.resource1.name)
      expect(resource.filter).toEqual(api.resources.resource1.filter)
      expect(resource.include).toEqual(api.resources.resource1.include)
    })

  })

})
