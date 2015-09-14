var AWS = require('aws-sdk');

var data = {
    region: 'us-east-1',
    instanceType: 't2.micro'
}

var act_inst = '';

var ec2 = new AWS.EC2({region: 'us-east-1', maxRetries: 15, apiVersion: 'latest'});

var params = {
  ImageId: 'ami-d05e75b8', // Ubuntu 14.04
  InstanceType: 't2.micro', //Free tier elligible instance
  MinCount: 1, MaxCount: 1,
  KeyName: 'id_rsa'
};

// Create the instance
ec2.runInstances(params, function(err, data) {
  if (err) { console.log("Could not create instance", err); return; }
  var instanceId = data.Instances[0].InstanceId;
  var publicDNS = data.Instances[0].PublicDnsName;
  var publicIP = data.Instances[0].PublicIpAddress;
  console.log("Created instance", instanceId);
  console.log("Public DNS name", publicDNS);
  console.log("Public IP addres", publicIP);
  act_inst = instanceId;
});


//delete instance
var params = {
  InstanceIds: [ act_inst ]
};

ec2.terminateInstances(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});