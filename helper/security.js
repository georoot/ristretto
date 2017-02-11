const jwt = require('jsonwebtoken');

var middleware = {};

middleware['getUser'] = (req,res,next)=>{
  var token = req.headers['authorization'];
  jwt.verify(token,process.env.Secret,(err,decoded)=>{
    if(err){
      res.status(400).json({err:"You have not provided authorization token"});
    }else{
      req.user = decoded;
      next();
    }
  });
}

middleware['allowByRole'] = (ArrayOfRoles)=>{
  return (req,res,next)=>{
    if(ArrayOfRoles.indexOf(req.user.role) > -1){
      next();
    }else{
      res.status(403).json({err:"Not authorized to access the resource"});
    }
  }
}


module.exports = middleware;
