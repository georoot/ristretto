const userModel = require('../models/user');
const crypto = require('crypto');
const inspect = require('util').inspect;
const buffersEqual = require('buffer-equal-constant-time');
const ssh2 = require('ssh2');
const utils = ssh2.utils;
var helper = {};

helper['auth'] = function(ctx,cmd){
  this.ctx = ctx;
  if(cmd == 'git-upload-pack')
    this.access = 'write';
  else
    this.access = 'read';

  this.getUserList = (data)=>{
    return new Promise((fullfill,reject)=>{
      if (this.access == 'write')
        fullfill(data.write);
      else
        fullfill(data.read);
    });
  }

  this.getUserKeys = (data)=>{
    return new Promise((fullfill,reject)=>{
      userModel
        .find({
          _id:{
            $in:data
          }
        })
        .then(fullfill)
        .catch(reject);
    });
  }

  this.getKeysAsArray = (data)=>{
    return new Promise((fullfill,reject)=>{
      var keys = [];
      for(var i=0;i<data.length;i++){
        keys = keys.concat(data[i].keys);
      }
      fullfill(keys);
    });
  }

  this.validateAccess = (data)=>{
    return new Promise((fullfill,reject)=>{
      var access = false;
      for (var i=0;i< data.length;i++){
        var ctx = this.ctx;
        var pubKey = utils.genPublicKey(utils.parseKey(data[i].value));
        if(ctx.key.algo === pubKey.fulltype && buffersEqual(ctx.key.data, pubKey.public)){
          if(ctx.signature){
            var verifier = crypto.createVerify(ctx.sigAlgo);
            verifier.update(ctx.blob);
            if (verifier.verify(pubKey.publicOrig, ctx.signature))
              access = true;
          }
        }
      }
      if(access)
        fullfill();
      else
        reject(new Error("You do not have access to the repo"));

    });
  }
}

module.exports = helper;
