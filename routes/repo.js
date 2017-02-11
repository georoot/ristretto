const express = require('express');
const crudHelper    = require('../helper/crud');
const model   = require('../models/repo');
const sec = require('../helper/security');
var crud = new crudHelper(model);
var route = express.Router();

/**
 * @api {get} /repo Request All user repositories
 * @apiName GetRepo
 * @apiGroup Repo
 * @apiHeader {String} Authorization Users unique access-key.
 *
 */
route.get("/",sec['getUser'],(req,res,next)=>{
  crud['list']({owner:req.user.username})
    .then((data)=>{
      res.json(data);
    })
    .catch((err)=>{
      res.status(400).json({err:err.message});
    });
});


/**
 * @api {get} /repo/:id Request specific repo information
 * @apiName GetRepoInfo
 * @apiGroup Repo
 *
 */
route.get("/:id",(req,res,next)=>{
  crud['getOne'](req.params.id)
    .then((data)=>{
      res.json(data);
    })
    .catch((err)=>{
      res.status(400).json({err:err.message});
    });
});

/**
 * @api {post} /repo Create new repository
 * @apiName CreateRepo
 * @apiGroup Repo
 * @apiParam {String} title Name of the repository
 * @apiHeader {String} Authorization Users unique access-key.
 */
route.post("/",sec['getUser'],(req,res,next)=>{
  req.body.owner = req.user.username;
  req.body.admin = [];req.body.admin.push(req.user._id);
  req.body.read = [];req.body.read.push(req.user._id);
  req.body.write = [];req.body.write.push(req.user._id);
  crud['add'](req.body)
    .then(()=>{
      res.status(200).end();
    })
    .catch((err)=>{
      res.status(400).json({err:err.message});
    });
});

/**
 * @api {put} /repo Update repository
 * @apiName UpdateRepo
 * @apiGroup Repo
 * @apiHeader {String} Authorization Users unique access-key.
 */
route.put("/",sec['getUser'],(req,res,next)=>{
  if(req.body.admin.includes(req.user._id)){
    crud['update'](req.body)
      .then((data)=>{
        res.json(data);
      })
      .catch((err)=>{
        res.status(400).json({err:err.message});
      });
  }else{
    res.status(400).json({err:"Unauthorized access"});
  }
});

/**
 * @api {delete} /repo/:id Delete repository
 * @apiName DeleteRepo
 * @apiGroup Repo
 * @apiHeader {String} Authorization Users unique access-key.
 */
route.delete("/:id",sec['getUser'],(req,res,next)=>{
  if(req.body.admin.includes(req.user._id)){
    crud['del'](req.params.id)
      .then(()=>{
        res.status(200).end();
      })
      .catch((err)=>{
        res.status(400).json({err:err.message});
      });
  }else{
    res.status(400).json({err:"Unauthorized access"});
  }
});

module.exports = route;
