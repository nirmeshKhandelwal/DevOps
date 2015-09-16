var needle = require("needle");
var os   = require("os");

var config = {};
config.token = "Enter your config token here";

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

// Documentation for needle:
// https://github.com/tomas/needle

var client =
{
	listRegions: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/regions", {headers:headers}, onResponse)
	},

	listImages: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/images", {headers:headers}, onResponse)
	},

	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			// Id to ssh_key already associated with account.
			"ssh_keys":[625870],
			//"ssh_keys":null,
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		console.log("Attempting to create: "+ JSON.stringify(data) );

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	},

	retrieveDropletInfo: function (dropletId, onResponse){
		var url = "https://api.digitalocean.com/v2/droplets/" + dropletId;
		needle.get(url, {headers:headers}, onResponse)
	},

	destroyDroplet: function (dropletId, onResponse){
		var url = "https://api.digitalocean.com/v2/droplets/" + dropletId;
		needle.delete(url, {headers:headers}, onResponse)
	}
};

// #############################################
// #1 Print out a list of available regions
// Comment out when completed.
// https://developers.digitalocean.com/#list-all-regions
// use 'slug' property

client.listRegions(function(error, response)
{
	// write a get request to : /v2/regions
	var data = response.body;

	if( response.headers )
	{
		console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
	}

	if( data.regions )
	{
		for(var i=0; i<data.regions.length; i++)
		{
			console.log(data.regions[i].name);
		}
	}
	//console.log( JSON.stringify(response.body) );
});


// #############################################
// #2 Extend the client object to have a listImages method
// Comment out when completed.
// https://developers.digitalocean.com/#images
// - Print out a list of available system images, that are AVAILABLE in a specified region.
// - use 'slug' property

client.listImages(function(error, response)
{
	// write a get request to : /v2/regions
	var data = response.body;	
	var regionToImage = new Object();

	if( data.images )
	{
		for(var i=0; i<data.images.length; i++){
			var regions = data.images[i].regions;
			var slug = data.images[i].slug;
			for(var j=0; j<regions.length; j++){
				if(regions[j] in regionToImage){
					var images = regionToImage[regions[j]];
					images.push(slug);
					regionToImage[regions[j]] = images;
				} else{
					regionToImage[regions[j]] = [slug];
				}
			}
		}
	}
	console.log( JSON.stringify(regionToImage) );
});

// #############################################
// #3 Create an droplet with the specified name, region, and image
// Comment out when completed. ONLY RUN ONCE!!!!!
// Write down/copy droplet id.
var name = "nbkhande"+os.hostname();
var region = "nyc1"; // Fill one in from #1
var image = "ubuntu-15-04-x64"; // Fill one in from #2
client.createDroplet(name, region, image, function(err, resp, body)
{
	console.log(body);
	// StatusCode 202 - Means server accepted request.
	if(!err && resp.statusCode == 202)
	{
		console.log( JSON.stringify( body, null, 3 ) );
	}
});
 


// #############################################
// #4 Extend the client to retrieve information about a specified droplet.
// Comment out when done.
// https://developers.digitalocean.com/#retrieve-an-existing-droplet-by-id
// REMEMBER POST != GET
// Most importantly, print out IP address!

var dropletId = "6878693";

client.retrieveDropletInfo(dropletId, function(error, response)
{
	// write a get request to : /v2/regions
	var data = response.body;

	if( response.headers )
	{
		console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
	}

	if( data.droplet )
	{	
		console.log("Image Id: " + data.droplet.id);
		console.log("Image Name: " + data.droplet.name);
		console.log("Ipv4 Address: " + data.droplet.networks.v4[0].ip_address);
	}
});

// #############################################
// #5 In the command line, ping your server, make sure it is alive!
// ping xx.xx.xx.xx
// ping 198.199.85.89

// #############################################
// #6 Extend the client to DESTROY the specified droplet.
// Comment out when done.
// https://developers.digitalocean.com/#delete-a-droplet
// HINT, use the DELETE verb.
// HINT #2, data needs passed as null.
// No response body will be sent back, but the response code will indicate success.
// Specifically, the response code will be a 204, which means that the action was successful with no returned body data.
client.destroyDroplet(dropletId, function(error, response){
	if(!error && response.statusCode == 204){
		console.log("Deleted!");
 	}
});

// #############################################
// #7 In the command line, ping your server, make sure it is dead!
// ping xx.xx.xx.xx
// ping 198.199.85.89
