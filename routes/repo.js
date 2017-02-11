const express = require('express');
const crudHelper    = require('../helper/crud');
const model   = require('../models/repo');
const sec = require('../helper/security');
var crud = new crudHelper(model);
var route = express.Router();

route.get("/",sec['getUser'],(req,res,next)=>{
  crud['list']({owner:req.user.username})
    .then((data)=>{
      res.json(data);
    })
    .catch((err)=>{
      res.status(400).json({err:err.message});
    });
});

route.get("/:id",(req,res,next)=>{
  crud['getOne'](req.params.id)
    .then((data)=>{
      res.json(data);
    })
    .catch((err)=>{
      res.status(400).json({err:err.message});
    });
});

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
