import Vue from 'vue'
import Request from '@/api/Request'

/*
  This will construct the api based on any config that has been passed
  The api will be a nested structure
  It would create something like { traction: { samples, saphyr: libraries, ... }, ...}
  So traction.saphyr.libraries would be a callable Request
  See Request for what it can do
  This is a world away from the first pass. It should be a lot easier to understand.
  There is a lot of repetition of the arguments but this makes it more readable.
  The next stage would be to use objects for the arguments or types to remove the repetition.
  It would also be better to have pipelines as nested resources and use recursion for better flexibility
*/

// we need to create a sub class of Vue and return the constructor
const cmp = Vue.extend(Request)

/*
 * @param {*} config - A piece of json containing all the apis, resources and pipeline
 * @param {*} environment - The current node environment which should contain the variables for the base URLs which are sensitive
 * @returns {*} an object of apis
 */
const build = ({ config, environment }) => {
  return config.reduce((result, api) => {
    return {
      ...result,
      // each api will be a property and we need to extract the baseURL from the environment
      [api.name]: buildApi({ ...api, baseURL: environment[`${api.baseURL}`] }),
    }
  }, {})
}

/*
 * @param {String} apiNamespace - the namespace of the API e.g. v1
 * @param {String} baseURL -  the base URL of the API
 * @param [*] resources - a list of end points
 * @param [*] pipelines - each api may have a set of pipelines e.g. traction has Saphyr, Pacbio and ONT
 * @returns {*} an object which is a set of nested resources
 *
 */
const buildApi = ({ apiNamespace, baseURL, resources, pipelines = [] }) => {
  const apiResources = buildResources({ apiNamespace, baseURL, resources })

  pipelines.forEach(({ name, resources }) => {
    apiResources[name] = buildResources({ apiNamespace, baseURL, resources, pipeline: name })
  })

  return apiResources
}

/*
 * @param {String} pipeline - e.g. Pacbio. Useful for nesting. e.g. traction.pacbio.requests
 * @returns {*} - an object which is a set of resources. Each resource will be a callabke request
 */
const buildResources = ({ apiNamespace, baseURL, resources, pipeline = null }) => {
  return resources.reduce((result, { name, filter, include, resources = [] }) => {
    return {
      ...result,
      // if the resource is part of a pipeline create the relevant path e.g. saphyr/requests otherwise just the resource
      [name]: buildRequest({
        apiNamespace,
        baseURL,
        resource: pipeline ? `${pipeline}/${name}` : name,
        filter,
        include,
        resources,
      }),
    }
  }, {})
}

/*
  for filter, include see the Request object
  * @param [*] - resources. A list of resources that belong to the request. e.g. runs can have plates and wells.
  * @returns - Request (Vue Component) - this would be better as a POJO
*/
const buildRequest = ({ apiNamespace, baseURL, resource, filter, include, resources }) => {
  if (resource === undefined) {
    console.log({ apiNamespace, baseURL, resource, filter, include, resources })
  }
  const request = new cmp({
    propsData: { apiNamespace, baseURL, resource, filter, include },
  })

  resources.forEach(({ name, filter, include }) => {
    // the resources path will be a combination of the parent resource and the child resource e.g. runs/plates
    request[name] = new cmp({
      propsData: {
        apiNamespace,
        baseURL,
        resource: `${request.resource}/${name}`,
        filter,
        include,
      },
    })
  })

  return request
}

export { build }

export default build
