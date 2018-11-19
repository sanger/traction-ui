// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('sequencescape.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.use('/api/v2/', router)

server.listen(3000, () => {
  console.log('JSON Server is running')
})

router.render = (req, res) => {
  res.setHeader('Accept', 'application/vnd.api+json')
  res.setHeader('Content-Type', 'application/vnd.api+json')

  res.jsonp({
    // JSORM
    // data: [{type: "requests", attributes: res.locals.data }]

    // AXIOS
    data: { attributes: { requests: res.locals.data } }
  })
}
