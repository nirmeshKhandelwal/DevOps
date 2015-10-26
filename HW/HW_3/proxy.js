var redis = require('redis')
var client = redis.createClient(6379, '127.0.0.1', {})
var http = require("http");
var proxy = require('http-proxy');

var servers = [ 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002' ]

// Push the server indexes into redis.
client.del('server_index')
client.rpush('server_index', 0)
client.rpush('server_index', 1)
client.rpush('server_index', 2)

var next = function(callback) {

}

// Create a proxy object for each target.
var proxies = [] 
for(var i=0; i<servers.length; i++){
  proxies.push( new proxy.createProxyServer({target: servers[i]}) );
}

var proxy = function(req, res) {
  console.log("request received")
  //Use circular list of redis using RPOPLPUSH
  client.rpoplpush('server_index', 'server_index', function(err, index) {
    if (err) throw err
    console.log(index)
    var proxy = proxies[index];
    proxy.web(req, res);
  })
}

var server = http.createServer(proxy);

server.listen(80, function() {
  var host = this.address().address
  var port = this.address().port
  console.log('Proxy Server listening at http://%s:%s', host, port)
});
