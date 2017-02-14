const model = require('../models/user');
const bcrypt= require('bcryptjs');
const jwt = require('jsonwebtoken');
const dir = require('mkdirp');

const SaltRound = parseInt(process.env.SaltRound);

var helper = {};

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

helper['setUserRole'] = (data)=>{
  return new Promise((fullfill,reject)=>{
    data.role = "user";
    fullfill(data);
  });
}

helper['save'] = (data)=>{
  return new Promise((fullfill,reject)=>{
    new model(data)
      .save()
      .then(()=>{
        dir(process.env.GitBase+"/"+data.username,(err)=>{
          if(err) reject();
          else{
            fullfill();
          }
        });
      })
      .then(fullfill)
      .catch(reject);
  });
}

helper['list'] = ()=>{
  return new Promise((fullfill,reject)=>{
    model
      .find()
      .select('-password -__v')
      .then(fullfill)
      .catch(reject);
  });
}

helper['findUser'] = (data)=>{
  return new Promise((fullfill,reject)=>{
    model
      .findOne({username:data.username})
      .then((user)=>{
        if(user == null){
          reject(new Error("Invalid username or password"));
        }else{
          data.user = user;
          fullfill(data);
        }
      })
      .catch(reject);
  });
}

helper['validatePassword'] = (data)=>{
  return new Promise((fullfill,reject)=>{
    bcrypt
      .compare(data.password,data.user.password)
      .then((res)=>{
        if(res == true){
          fullfill(data);
        }else{
          reject(new Error("Invalid username or password"));
        }
      })
      .catch(reject);
  });
}

helper['generateToken'] = (data)=>{
  return new Promise((fullfill,reject)=>{
    try{
      var user = data.user.toObject();
      var token = jwt.sign(user,process.env.Secret);
      fullfill(token);
    }catch(err){
      reject(err);
    }
  });
}

module.exports = helper;
