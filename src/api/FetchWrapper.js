/**
 * A node fetch wrapper to abstract standard fetch calls.
 * Used to simplify non JSON API compliant services and to provide a consistent interface for all fetch calls.
 *
 * @param {string} baseUrl - The base URL of the API.
 * @param {string} serviceName - The name of the service being accessed.
 * @returns {Object} An object containing the base URL, service name, and a post method.
 */
const FetchWrapper = (baseUrl, serviceName) => {
  return {
    baseUrl: baseUrl,
    serviceName: serviceName,
    /**
     * Sends a POST request to the specified endpoint with the provided body.
     *
     * @param {string} endpoint - The API endpoint to send the request to.
     * @param {Object} body - The request payload to be sent in the body of the POST request.
     * @returns {Promise<Object>} A promise that resolves to an object containing:
     *   - {boolean} success - Indicates whether the request was successful.
     *   - {Array<string>} errors - An array of error messages, if any.
     *   - {Object} data - The response data from the server.
     */
    post: async function (endpoint, body, content_type = 'application/json') {
      try {
        const url = `${this.baseUrl}${endpoint}`
        const rawResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': content_type,
          },
          body,
        })

        const response = await rawResponse.json()

        if (!rawResponse.ok) {
          return { success: false, errors: response.errors || ['An error occurred'], data: {} }
        }

        return { success: true, errors: [], data: response }
      } catch (error) {
        return {
          success: false,
          errors: [`Failed to access ${this.serviceName}: ${error.message}`],
          data: {},
        }
      }
    },
  }
}

export { FetchWrapper }
