const express = require('express');
const mongoose = require('mongoose');
const loader = require('require-dir');

var app = express();

var routes = loader('./routes');
for(var route in routes){
  app.use("/"+route,routes[route]);
}

app.use((req,res,next)=>{
  res.status(404).json({err: "Route not found"});
});

app.listen(3000);
module.exports = app;
