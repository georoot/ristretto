const express = require('express');
var route = express.Router();

route.get("/",(req,res,next)=>{
  var config = {};
  config.host = process.env.Host;
  config.port = process.env.GitPort;
  res.json([config]);
});

module.exports = route;
