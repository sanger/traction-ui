const mockResponse = {
  status: 200,
  data: { data: [{ id: 1 }] },
}

const mockCreate = { data: { status: 201 } }

const mockAxios = {
  defaults: {},
  // This isn't quite right. Ideally we'd return a new object here, but that
  // makes it difficult to use our spies. I think we might be better ignoring
  // axios, and mocking the requests themselves.
  create: (defaults = {}) => {
    mockAxios.defaults = defaults
    return mockAxios
  },
  post: () => mockCreate,
  delete: () => mockResponse,
  get: () => mockResponse,
  patch: () => mockResponse,
  update: () => mockResponse,
}
export default mockAxios
