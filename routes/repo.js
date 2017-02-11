const express = require('express');
const crudHelper    = require('../helper/crud');
const model   = require('../models/repo');
var crud = new crudHelper(model);
var route = express.Router();

route.get("/",(req,res,next)=>{
  crud['list']({})
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

route.post("/",(req,res,next)=>{
  crud['add'](req.body)
    .then(()=>{
      res.status(200).end();
    })
    .catch((err)=>{
      res.status(400).json({err:err.message});
    });
});

route.put("/",(req,res,next)=>{
  crud['update'](req.body)
    .then((data)=>{
      res.json(data);
    })
    .catch((err)=>{
      res.status(400).json({err:err.message});
    });
});

route.delete("/:id",(req,res,next)=>{
  crud['del'](req.params.id)
    .then(()=>{
      res.status(200).end();
    })
    .catch((err)=>{
      res.status(400).json({err:err.message});
    });
});

module.exports = route;
