var redis = require('redis')
var multer = require('multer')
var express = require('express')
var fs = require('fs')
var app = express()
var bunyan = require('bunyan');

var log = bunyan.createLogger({
  name: 'myapp',
  streams: [
    {
      level: 'info',
      stream: 'myapp-info.log'        // log INFO and above to stdout
    },
    {
      level: 'error',
      path: 'myapp-error.log'         // log ERROR and above to a file
    }
  ]
});


var upload = multer({
    dest: './uploads/'
  })
  // REDIS
var args = process.argv.slice(2);
var port = args[0] || 3000
var client = redis.createClient(6379, '127.0.0.1', {})

app.use(function(req, res, next) {
	//console.log(req)
  console.log(req.url);
  console.log(req.get('host'));
  var recentUrl = req.protocol + '://' + req.get('host') + req.url
  client.lpush('recentUrl', recentUrl)
  client.ltrim('recentUrl', 0, 4)
  log.info(port + '|' + recentUrl)   //Log the info  alongwith port to make sure that proxy works fine
  next();
});

//app.use(app.router); // The Express routes handler.

app.get('/get', function(req, res) {
  {
    client.get("myKey", function(err, value) {
      res.writeHead(200, {
        'content-type': 'text/html'
      });
      if (value) res.write(value);
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
    res.writeHead(200, {
      'content-type': 'text/html'
    });
    res.write("<p> myKey set to expire for 10 seconds </p>");
    res.end();
  }
})

app.get('/recent', function(req, res) {
  {
    res.writeHead(200, {
      'content-type': 'text/html'
    });
    var responseString = "<ul>"
    client.lrange('recentUrl', 0, -1, function(err, value) {
      console.log(value)
      for (var i = 0; i < value.length; i++) {
        responseString += "<li>" + value[i] + "</li>"
      }
      responseString += "</ul>"
      res.write(responseString);
      res.end();
    })
  }
})

app.post('/upload', upload.array('image'), function(req, res) {
  //console.log(req)
  console.log(req.body) // form fields
  console.log(req.files) // form files

  for (var i = 0; i < req.files.length; i++) {
    console.log(req.files[i])
    if (req.files[i]) {
      fs.readFile(req.files[i].path, function(err, data) {
        if (err) throw err;
        var img = new Buffer(data).toString('base64');
        client.rpush('images', img)
        console.log(img);
      });
    }
  }
  res.status(204).end()
});

app.get('/meow', function(req, res) {
  {
    res.writeHead(200, {
      'content-type': 'text/html'
    });
    client.rpop('images', function(err, val) {
      if (err) throw err;
      if (val) {
        res.write("<h1>\n<img src='data:my_pic.jpg;base64," + val + "'/>");
      } else {
        res.write("No new image to display")
      }
      res.end();
    })
  }
})


// HTTP SERVER
// In order to create multiple instances on different port
// take port number as command line argument
var server1 = app.listen(port, function(err, val) {
  var host = this.address().address
  var port = this.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})
