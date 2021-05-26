import Vue from 'vue'
import Request from '@/api/Request'

const build = (config, environment) => {
  return Object.keys(config).reduce((result, key) => {
    result[key] = buildResources({ ...config[key], baseURL: environment[`${config[key].baseURL}`]})
    return result
  }, {})
}

const buildResources = ({ apiNamespace, baseURL, resources }) => {
  const pipelines = ['pacbio', 'saphyr']

  return Object.keys(resources).reduce((result, key) => {
    if (pipelines.includes(key)) {
      result[key] = Object.keys(resources[key]).reduce((accumulator, resource) => {
        accumulator[resource] = buildComponent(
          Request,
          { apiNamespace, baseURL, resource: key + '/' + resource, ...resources[key][resource] },
        )
        return accumulator
      }, {})
    } else {
      result[key] = buildComponent(
        Request,
        { apiNamespace, baseURL, resource: key, ...resources[key] }
      )
    }
    return result
  }, {})
}

const buildComponent = (component, props) => {
  const cmp = Vue.extend(component)
  const vm = new cmp({ propsData: props })
  for (const key in props['resources']) {
    const request = new cmp({ propsData: { ...props, resource: `${vm.resource}/${key}` } })
    vm[key] = request
  }
  return vm
}

export { buildComponent, build }

export default build
