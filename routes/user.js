const express = require('express');
const helper  = require('../helper/auth');
const sec = require('../helper/security');

var route = express.Router();

/**
 * @api {post} /user Signup route for user
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} username Username for the person
 * @apiParam {String} password Password for the person
 */
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
