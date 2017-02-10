const model = require('../models/user');
const bcrypt = require('bcrypt');
const SaltRound = parseInt(process.env.SaltRound);
var helper = {};

helper['findOne'] = (data)=>{
  return new Promise((fullfill,reject)=>{
    model
      .findOne({username: data.username})
      .then((user)=>{
        if(user == null){
          reject(new Error("Non existant user"));
        }else{
          data.user = user;
          fullfill(data);
        }
      })
      .catch(reject);
  });
}

helper['validate'] = (data)=>{
  return new Promise((fullfill,reject)=>{
    bcrypt
      .compare(data.password,data.user.password)
      .then((res)=>{
        if(res == true){
          fullfill(data.user.toObject());
        }else{
          reject(new Error("Invalid credentials"));
        }
      })
      .catch(reject);
  });
}

helper['hashPassword'] = (data)=>{
  return new Promise((fullfill,reject)=>{
    if(data.password == null){
      reject(new Error("No password provided"));
    }else{
      bcrypt.hash(data.password,SaltRound,(err,hash)=>{
        if(err) reject(err);
        else{
          data.password = hash;
          fullfill(data);
        }
      });
    }
  });
}

helper['save'] = (data)=>{
  return new Promise((fullfill,reject)=>{
    new model(data)
      .save()
      .then(fullfill)
      .catch(reject);
  });
}

module.exports = helper;
