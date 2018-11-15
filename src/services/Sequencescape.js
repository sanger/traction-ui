const {
  JSORMBase,
  attr
} = require('jsorm/dist/jsorm')

const ApplicationRecord = JSORMBase.extend({
  static: {
    baseUrl: process.env.VUE_APP_SEQUENCESCAPE_BASE_URL,
    apiNamespace: 'api/v2'
  }
})

const Request = ApplicationRecord.extend({
  // static: {
  //   jsonapiType: "requests"
  // },
  attrs: {
    id: attr(),
    name: attr()
  }
})

export default Request