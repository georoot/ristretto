const express = require('express');
const helper  = require('../helper/auth');
const sec = require('../helper/security');

var route = express.Router();

route.post("/",(req,res,next)=>{
  helper['hashPassword'](req.body)
    .then(helper['setUserRole'])
    .then(helper['save'])
    .then(()=>{
      res.status(200).end();
    })
    .catch((err)=>{
      res.status(400).json({err:err.message});
    });
});

route.get("/",(req,res,next)=>{
  helper['list']({})
    .then((data)=>{
      res.json(data);
    })
    .catch((err)=>{
      res.status(400).json({err:err.message});
    });
});

route.post("/token",(req,res,next)=>{
  helper['findUser'](req.body)
    .then(helper['validatePassword'])
    .then(helper['generateToken'])
    .then((token)=>{
      res.json({token:token});
    })
    .catch((err)=>{
      res.status(400).json({err:err.message});
    });
});

module.exports = route;
