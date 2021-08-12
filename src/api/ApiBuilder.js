import createRequest from '@/api/createRequest'

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
      [api.name]: buildApi({ ...api, rootURL: environment[api.baseURL] }),
    }
  }, {})
}

/*
 * @param {String} apiNamespace - the namespace of the API e.g. v1
 * @param {String} rootURL -  the base URL of the API
 * @param [*] resources - a list of end points
 * @param [*] pipelines - each api may have a set of pipelines e.g. traction has Saphyr, Pacbio and ONT
 * @returns {*} an object which is a set of nested resources
 *
 */
const buildApi = ({ apiNamespace, rootURL, resources, pipelines = [] }) => {
  const apiResources = buildResources({ apiNamespace, rootURL, resources })

  pipelines.forEach(({ name, resources }) => {
    apiResources[name] = buildResources({ apiNamespace, rootURL, resources, pipeline: name })
  })

  return apiResources
}

/*
 * @param {String} pipeline - e.g. Pacbio. Useful for nesting. e.g. traction.pacbio.requests
 * @returns {*} - an object which is a set of resources. Each resource will be a callabke request
 */
const buildResources = ({ apiNamespace, rootURL, resources, pipeline = null }) => {
  return resources.reduce((result, { name, resources = [] }) => {
    return {
      ...result,
      // if the resource is part of a pipeline create the relevant path e.g. saphyr/requests otherwise just the resource
      [name]: buildRequest({
        apiNamespace,
        rootURL,
        resource: pipeline ? `${pipeline}/${name}` : name,
        resources,
      }),
    }
  }, {})
}

/*
 * @param [*] - resources. A list of resources that belong to the request. e.g. runs can have plates and wells.
 * @returns {Request} - a request
 */
const buildRequest = ({ apiNamespace, rootURL, resource, resources }) => {
  const request = createRequest({ apiNamespace, rootURL, resource })

  resources.forEach(({ name }) => {
    // the resources path will be a combination of the parent resource and the child resource e.g. runs/plates
    request[name] = createRequest({
      apiNamespace,
      rootURL,
      resource: `${request.resource}/${name}`,
    })
  })

  return request
}

export { build }

export default build
