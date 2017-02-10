require('dotenv').config();
const ssh2 = require('ssh2');
const fs = require('fs');
const helper = require('./lib/ssh');
var pkey = fs.readFileSync(process.env.privateKey);

var server = new ssh2.Server({
    hostKeys: [pkey.toString()]
  },(client)=>{
    client
      .on('authentication',helper['authenticate'])
      .on('ready',()=>{
        client.on('session',helper['ready'](client));
      });
  });
server.listen(8090,'127.0.0.1',()=>{
    console.log('listening on port 8090');
  });
