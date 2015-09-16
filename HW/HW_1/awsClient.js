var AWS = require('aws-sdk');

exports.createInstance = function(onResponse){
  var ec2 = new AWS.EC2({region: 'us-east-1', maxRetries: 15, apiVersion: 'latest'});

  var params = {
    ImageId: 'ami-d05e75b8', // Ubuntu 14.04
    InstanceType: 't2.micro', //Free tier elligible instance
    MinCount: 1, MaxCount: 1,
    KeyName: 'hw_1'
  };

  console.log('[INFO] Spinning up AWS instance...')

  // Create the instance
  ec2.runInstances(params, function(err, data) {
      if (err) {
        onResponse(err, null);
        return; 
      }
      console.log("[INFO] Instance requested from AWS..")
      
      response = {
        instanceId: data.Instances[0].InstanceId,
        user: 'ubuntu'
      }

      // Poll till the machine is up and running. 
      var refreshId = setInterval(function(){
        ec2.describeInstances(
          {InstanceIds: [response.instanceId]}, 
          function(err, data) {
            var state = data.Reservations[0].Instances[0].State.Name;
            if (err){
              console.log(err, err.stack); // an error occurred
            } else if(state != null & state == 'running'){
              response.ip = data.Reservations[0].Instances[0].PublicIpAddress;
              onResponse(null, response);
              clearInterval(refreshId);
            }
        })
      }, 1000); 
  });
}

exports.terminate = function(instanceId, onResponse){
  var params = {InstanceIds: [instanceId]}
  ec2.terminateInstances(params, function(err, data) {
    if (err) onResponse(err, null) // an error occurred
    else     onResponse(null, data)           // successful response
  });
}