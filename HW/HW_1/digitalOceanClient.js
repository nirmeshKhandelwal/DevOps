var needle = require("needle");
var os   = require("os");

exports.createInstance = function (onResponse){
    var config = {};
    config.token = process.env.DIGITAL_OCEAN_TOKEN;
    config.ssh_key = process.env.DIGITAL_OCEAN_KEY_ID;

    var headers =
    {
        'Content-Type':'application/json',
        Authorization: 'Bearer ' + config.token
    };

    var data = 
    {
        "name":  'nbkhande'+os.hostname(),
        "region":'nyc1',
        "size":"512mb",
        "image":'ubuntu-14-04-x64',
        "ssh_keys":[config.ssh_key],
        "backups":false,
        "ipv6":false,
        "user_data":null,
        "private_networking":null
    };

    console.log('[INFO] Spinning up digital ocean instance...')

    needle.post("https://api.digitalocean.com/v2/droplets", 
        data, {headers:headers,json:true}, function(err, resp, body){
        // StatusCode 202 - Means server accepted request.

        if(err) console.log(err)
        else if(!err && resp.statusCode == 202){
            dropletId = body.droplet.id;
            console.log("[INFO] Instance requested from Digital Ocean..");

            // Poll till the machine is up and running. 
            var refreshId = setInterval(function(){
                var url = "https://api.digitalocean.com/v2/droplets/" + dropletId;
                needle.get(url, {headers:headers}, function(err, response){
                    var droplet = response.body.droplet;
                    if( droplet.status == 'active' )
                    {   
                        info = {
                            'image_id': droplet.id,
                            'ip': droplet.networks.v4[0].ip_address,
                            'user': 'root'
                        }
                        onResponse(null, info);
                        clearInterval(refreshId);
                    }
                });
            }, 1000);
        }
    });
};

exports.destroyDroplet = function (dropletId, onResponse){
    var url = "https://api.digitalocean.com/v2/droplets/" + dropletId;
    needle.delete(url, {headers:headers}, onResponse)
}