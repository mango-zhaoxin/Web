const http = require('http')
const options = {
  hostname: '127.0.0.1',
  port: 80,
  path: '/',
  method: 'GET'
}
const req = http.request(options, (res) => {
  console.log(`Status=${res.statusCode}, Headers=$ {JSON.stringify(res.headers)}`);
  res.setEncoding('utf8')
  res.on('data', (data) => {
    console.log(data)
  })
})
req.end()