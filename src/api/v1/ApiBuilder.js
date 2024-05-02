import createRequest from '@/api/v1/createRequest'

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
 * @returns {*} an object of apis
 */
const build = ({ config }) => {
  return config.reduce((result, api) => {
    return {
      ...result,
      // each api will be a property
      [api.name]: buildApi({ ...api }),
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
const buildApi = ({ apiNamespace, rootURL, resources, pipelines = [], headers = {} }) => {
  const apiResources = buildResources({ apiNamespace, rootURL, resources, headers })

  pipelines.forEach(({ name, resources }) => {
    apiResources[name] = buildResources({
      apiNamespace,
      rootURL,
      resources,
      pipeline: name,
      headers,
    })
  })

  return apiResources
}

/*
 * @param {String} apiNamespace - the namespace of the API e.g. v1
 * @param {String} rootURL -  the base URL of the API
 * @param [*] resources - a list of end points
 * @param {String} pipeline - e.g. Pacbio. Useful for nesting. e.g. traction.pacbio.requests
 * @param {String} headers - headers for the request
 * @returns {*} - an object which is a set of resources. Each resource will be a callable request
 */
const buildResources = ({ apiNamespace, rootURL, resources, pipeline = null, headers }) => {
  return resources.reduce((result, { name, resources = [] }) => {
    return {
      ...result,
      // if the resource is part of a pipeline create the relevant path e.g. saphyr/requests otherwise just the resource
      [name]: buildRequest({
        apiNamespace,
        rootURL,
        resource: pipeline ? `${pipeline}/${name}` : name,
        resources,
        headers,
      }),
    }
  }, {})
}

/*
 * @param [*] - resources. A list of resources that belong to the request. e.g. runs can have plates and wells.
 * @returns {Request} - a request
 */
const buildRequest = ({ apiNamespace, rootURL, resource, resources, headers }) => {
  const request = createRequest({ apiNamespace, rootURL, resource, headers })

  resources.forEach(({ name }) => {
    // the resources path will be a combination of the parent resource and the child resource e.g. runs/plates
    request[name] = createRequest({
      apiNamespace,
      rootURL,
      resource: `${request.resource}/${name}`,
      headers,
    })
  })

  return request
}

export { build }

export default build
