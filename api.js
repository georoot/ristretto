const express = require('express');
const mongoose = require('mongoose');
const loader = require('require-dir');
mongoose.connect('mongodb://'+process.env.DbHost+'/'+process.env.DbName);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

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
