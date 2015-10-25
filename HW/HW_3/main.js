var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()

// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

///////////// WEB ROUTES


// Your own super cool function

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next)
{
	console.log(req.method, req.url);
	client.lpush('recentUrl', req.protocal + '://' + req.get('host') + req.url)
	client.ltrim('recentUrl', 0, 4)

	next();
});

//app.use(app.router); // The Express routes handler.

app.get('/get', function(req, res) {
 	{
			client.get("myKey", function(err, value){
			res.writeHead(200, {'content-type':'text/html'});
			if(value) res.write(value);
			else res.write('<p> Key not found </p>');
			console.log(value)
			res.end();
		});
 	}
})

app.get('/set', function(req, res) {
 	{
		client.set('myKey', 'this message will self-destruct in 10 seconds')
		client.expire('myKey', 10)
 		res.writeHead(200, {'content-type':'text/html'});
    res.write("<p> myKey set to expire for 10 seconds </p>");
    res.end();
 	}
})

app.get('/recent', function(req, res) {
 	{
		res.writeHead(200, {'content-type':'text/html'});
		res.write("<ul>")
		client.lrange('recentUrl', 0, -1, function(err, value){
			console.log(value)
			for (var i in value){
				res.write("<li>" + value[i] + "</li>");
			}
		})
    res.write("</ul>");
    res.end();
 	}
})

// HTTP SERVER
var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log('Example app listening at http://%s:%s', host, port)
 })
