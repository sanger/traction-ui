var jsonApi = require("jsonapi-server");
var samples = require('./sequencescape.json');

jsonApi.setConfig({
  port: 3200,
  base: "api/v2"
});

jsonApi.define({
  resource: "requests",
  handlers: new jsonApi.MemoryHandler(),
  attributes: {
    id: jsonApi.Joi.number().integer(),
    name: jsonApi.Joi.string(),
    species: jsonApi.Joi.string(),
    state: jsonApi.Joi.string(),
    request_type: jsonApi.Joi.string() 
  },
  examples: samples.requests
});

jsonApi.start();
