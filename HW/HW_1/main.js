var needle = require('needle')
var fs = require('fs')
var sys = require('sys')
var exec = require('child_process').exec;
var aws = require('./awsClient.js')
var digitalOcean = require('./digitalOceanClient.js')

var up_instances = 0; //variable to track total number of instances up and running

fs.writeFile('inventory', '[webservers]\n', function (err) {
  if (err) throw err;
  console.log('[INFO] Initialized the inventory File');
});

aws.createInstance(function(err, data){
    if(err) console.log('[ERR] Could not create aws instance', err);
    if(data) { 
      console.log(data);
      var inventory_entry =  
        data.ip 
        + ' ansible_connection=ssh ansible_ssh_user=' + data.user
        + ' ansible_ssh_private_key_file=' + process.env.AWS_PRIVATE_KEY_PATH
        +'\n';

      fs.appendFile('inventory', inventory_entry, function (err) {
          if (err) throw err;
          console.log('[INFO] Added AWS entry to inventory file');
          up_instances ++;
      });
    } 
});

digitalOcean.createInstance(function(err, data){
    if (err) { 
        console.log('[ERR] Could not create aws instance', err);
        return; 
    } 

    if(data){
      var inventory_entry =  
      data.ip 
      + ' ansible_connection=ssh ansible_ssh_user=' + data.user
      + ' ansible_ssh_private_key_file='+ process.env.DIGITAL_OCEAN_KEY_PATH
      +'\n';

      fs.appendFile('inventory', inventory_entry, function (err) {
          if (err) throw err;
          console.log('[INFO] Added Digital ocean entry to inventory file');
          up_instances ++;
      });
    } 
});

function call_playbook(){
    console.log('[INFO] Inventory file generated')
    console.log('[INFO] Waiting for 60 second so that all the machines are ready.');
    console.log('[INFO] Running the Playbook..')
    function puts(error, stdout, stderr) { sys.puts(stdout) }
    exec("ansible/bin/ansible-playbook playbook.yml -i inventory", puts);
}

//Wait for both the instances to be up
var refreshId = setInterval(function(){
    if(up_instances == 2){  
        setTimeout(call_playbook, 90000); // 60 seconds pass..
        clearInterval(refreshId); 
    }
}, 1000);
