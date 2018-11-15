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
  let json = {
    data: {
      attributes: {
        requests: []
      }
    }
  }
  res.header('Content-Type', 'application/vnd.api+json')
  res.jsonp({
    body: json
  })
}