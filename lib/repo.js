const model = require('../models/repo');

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


module.exports = helper;
