/**
 * A node fetch wrapper to abstract standard fetch calls.
 * Used to simplify non JSON API compliant services and to provide a consistent interface for all fetch calls.
 */
class FetchWrapper {
  /**
   * Creates an instance of FetchWrapper.
   *
   * @constructor
   * @param {string} baseUrl - The base URL for the API.
   * @param {string} serviceName - The name of the service for error reporting.
   */
  constructor(baseUrl, serviceName) {
    this.baseUrl = baseUrl
    this.serviceName = serviceName
  }

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
  async post(endpoint, body) {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const rawResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
  }
}

export { FetchWrapper }
