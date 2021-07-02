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
  }) => {
   const baseURL = `${rootURL}/${apiNamespace}`
   const api = axios.create({baseURL, headers})

   return {
    rootURL,
    apiNamespace,
    resource,
    headers,
    baseURL,
    api,
   }
}

export {
  defaultHeaders,
  createRequest
}

export default createRequest