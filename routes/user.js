const express = require('express');
const userModel = require('../models/user');
const crudHelper = require('../helper/crud');
const helper  = require('../helper/auth');
const sec = require('../helper/security');

var route = express.Router();
var crud = new crudHelper(userModel);

/**
 * @api {post} /user Signup route for user
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} username Username for the person
 * @apiParam {String} password Password for the person
 */
route.post("/",(req,res,next)=>{
  req.body.keys = [];
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

/**
 * @api {get} /user Request all User information
 * @apiName GetUsers
 * @apiGroup User
 *
 * @apiPermission admin
 */
route.get("/",sec['getUser'],sec['allowByRole'](["admin"]),(req,res,next)=>{
  helper['list']({})
    .then((data)=>{
      res.json(data);
    })
    .catch((err)=>{
      res.status(400).json({err:err.message});
    });
});

route.get("/me",sec['getUser'],(req,res,next)=>{
  crud.getOne(req.user._id)
    .then((data)=>{
      res.json(data);
    })
    .catch((err)=>{
      res.status(400).json({err:err.message});
    });
});

route.put("/me",sec['getUser'],(req,res,next)=>{
  crud.update(req.body)
    .then((data)=>{
      res.json(data);
    })
    .catch((err)=>{
      res.status(400).json({err:err.message});
    });
});

/**
 * @api {post} /user/token Generate authentication token
 * @apiName GnerateToken
 * @apiGroup User
 *
 * @apiParam {String} Username for the user.
 * @apiParam {String} Password for the user.
 */
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
