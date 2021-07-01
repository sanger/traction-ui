import axios from 'axios'

const defaultHeaders = {
  'Content-Type': 'application/vnd.api+json',
  Accept: 'application/vnd.api+json',
}

const createRequest = ({
    rootURL,
    apiNamespace,
    resource,
    headers = defaultHeaders
  }) => ({
   rootURL,
   apiNamespace,
   resource,
   headers,
   baseURL: `${rootURL}/${apiNamespace}`,
   api: axios.create({baseURL: `${rootURL}/${apiNamespace}`, headers})
})

export {
  defaultHeaders,
  createRequest
}

export default createRequest