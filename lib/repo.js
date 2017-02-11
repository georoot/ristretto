const model = require('../models/repo');
const authService = require('./auth');

var helper = {};

helper['createRepo'] = (data)=>{
  return new Promise((fullfill,reject)=>{
    var obj = {};
    obj.title = data.repoName;
    obj.owner = data.user.username;
    obj.read = [];
    obj.write = [];
    obj.admin = [];
    obj.read.push(data.user._id);
    obj.write.push(data.user._id);
    obj.admin.push(data.user._id);
    new model(obj)
      .save()
      .then(fullfill)
      .catch(reject);
  });
}

helper['hasAccess'] = (data)=>{
  return new Promise((fullfill,reject)=>{
    var repo = data.repo.split("/");
    var user = repo[1];
    repo = repo[2].split(".")[0];
    var authCtx = new authService['auth'](data.ctx,data.cmd);
    model
      .findOne({title: repo,owner:user})
      .then(authCtx.getUserList)
      .then(authCtx.getUserKeys)
      .then(authCtx.getKeysAsArray)
      .then(authCtx.validateAccess)
      .then(fullfill)
      .catch(reject);
  });
}


module.exports = helper;
