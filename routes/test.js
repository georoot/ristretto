const express = require('express');

var route = express.Router();
route.get("/",(req,res,next)=>{
  res.send("This is just a test route for api");
});
module.exports = route;
