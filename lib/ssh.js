const inspect = require('util').inspect;
var helper = {};

helper['authenticate'] = (ctx)=>{
  console.log(ctx.user);
  console.log(ctx.password);
  if(ctx.user == ctx.password){
    ctx.accept();
    console.log("Accepting connection");
  }else{
    ctx.reject();
  }
}

helper['ready'] = function(client){
  this.client = client;
  return ('session',(accept,reject)=>{
    this.session = accept();
    this.session.once('exec',(accept, reject, info)=>{
      console.log('Client wants to execute: ' + inspect(info.command));
      var stream = accept();
      stream.stderr.write('Throw errors');
      stream.write('Write normal content');
      stream.exit(0);
      stream.end();
    });
  });
}

module.exports = helper;
