Cache, Proxies, Queues
=========================

### Get, Set and Recent
- ![get-set-recent](img/get-set-recent.gif)

### Image upload
- ![img upload](img/image_upload.gif)

### Proxy server
- Start 3 different servers on port 3000, 3001 and 3002. The main.js accepts port number as command line argument
```bash
node main.js 3000
node main.js 3001
node main.js 3002
```
- Start proxy server on port 80: `sudo node proxy.js`. Note: sudo access required to start server on port 80.
- Hit multiple urls on `http://localhost/`. The proxy will redirect them evenly on 3000, 3001 and 3002 instances. This is implemented using circular list in redis `RPOPLPUSH`.
- In order to make sure that the proxy works, we write the logs in `myapp-error.log` alongwith the port number of the server. To count the number of requests served by each instance, use 
```bash
grep '3000' myapp-error.log
grep '3001' myapp-error.log
grep '3002' myapp-error.log
```
- ![proxy](img/proxy-server.gif)


### Setup

* Clone this repo, run `npm install`.
* Install redis and run on localhost:6379
