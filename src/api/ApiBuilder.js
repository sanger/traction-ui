import Vue from 'vue'
import Request from '@/api/Request'

const build = (config, environment) => {
  return Object.keys(config).reduce((result, key) => {
    const { resources, ...props } = config[key]
    result[key] = buildResources(resources, apiProps(key, props, environment))
    return result
  }, {})
}

const buildResources = (resources, props) => {
  let pipelines = ['saphyr', 'pacbio']

  return Object.keys(resources).reduce((result, key) => {
    if (pipelines.includes(key)) {
      result[key] = Object.keys(resources[key]).reduce((accumulator, resource) => {
        accumulator[resource] = buildComponent(
          Request,
          Object.assign(props, { resource: key + '/' + resource, ...resources[key][resource] }),
        )
        return accumulator
      }, {})
    } else {
      result[key] = buildComponent(
        Request,
        Object.assign(props, { resource: key, ...resources[key] }),
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

const apiProps = (api, props, environment) => {
  const baseURL = environment[`VUE_APP_${api.toUpperCase()}_BASE_URL`]
  if (baseURL === undefined) {
    console.error(
      `It looks like you haven't set the environment variable for ${api}. Please set it in the .env file`,
    )
  }
  return { baseURL: baseURL, ...props }
}

export { buildComponent, build }

export default build
