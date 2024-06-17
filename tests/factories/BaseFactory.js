/**
 *
 * @param {*} data
 * @returns {Object} {content: {...data}, responses: {axios: {...}, fetch: {...} }
 * A base factory that returns an object with a content key that contains the data passed in and a responses key that contains an axios and fetch key that contains the data passed in.
 */

const BaseFactory = (data) => {
  return {
    content: { ...data },
    responses: {
      axios: {
        status: 200,
        statusText: 'OK',
        ...data,
      },
      fetch: {
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ ...data }),
      },
    },
  }
}

export default BaseFactory
