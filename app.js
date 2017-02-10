require('dotenv').config();
const ssh2 = require('ssh2');
const fs = require('fs');
const mongoose = require('mongoose');
const helper = require('./lib/ssh');
var pkey = fs.readFileSync(process.env.privateKey);

mongoose.connect('mongodb://'+process.env.DbHost+'/'+process.env.DbName);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var server = new ssh2.Server({
    hostKeys: [pkey.toString()]
  },(client)=>{
    helper(client);
  });
server.listen(8090,'127.0.0.1',()=>{
    console.log('listening on port 8090');
  });
