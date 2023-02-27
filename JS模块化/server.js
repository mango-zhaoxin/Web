var http = require("http");
var PORT = 8000;

http.createServer(function (req, res) {
  res.end('hello world');
}).listen(PORT);

console.log('listen to' + PORT);


