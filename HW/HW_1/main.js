var needle = require('needle')
var aws = require('./awsClient.js')
//var digitalOcean = require('./digitalOceanClient.js')
var fs = require('fs')

fs.writeFile('inventory', '[webservers]\n', function (err) {
  if (err) throw err;
  console.log('[INFO] Initialized the inventory File');
});

console.log('[INFO] Spinning up AWS instance...')

aws.createInstance(function(err, data){
    if (err) { 
        console.log('[ERR] Could not create aws instance', err);
        return; 
    }   
    console.log(data);
    var inventory_entry =  
      'ansible_ssh_host=' + data.ip 
      + ' ansible_connection=ssh ansible_ssh_user=' + data.user
      + ' ansible_ssh_private_key_file=' + process.env.AWS_PRIVATE_KEY
      +'\n';

    fs.appendFile('inventory', inventory_entry, function (err) {
        if (err) throw err;
        console.log('[INFO] Added AWS entry to inventory file');
    });
});

console.log('Spinning up Digital Ocean droplet...')
console.log('Checking status of machines..')
/*
check status of machines:
AWS: 
Digital Ocean: 
*/