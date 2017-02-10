const inspect = require('util').inspect;
const spawn = require('child_process').spawn;
var helper = {};

helper['authenticate'] = (ctx)=>{
  console.log(ctx.user);
  console.log(ctx.password);
  if(ctx.method === 'password'){
    ctx.reject();
  }else if (ctx.method === 'publickey'){
    console.log('public key auth');
    ctx.reject();
  }else{
    ctx.reject();
  }
}

helper['ready'] = function(client){
  this.client = client;
  return ('session',(accept,reject)=>{
    this.session = accept();
    this.session.once('exec',(accept, reject, info)=>{
      var command = info.command;
      console.log(command);
      var expCommand = command.split(" ");
      if(expCommand[0] == 'git-upload-pack' || expCommand[0] == 'git-receive-pack'){
        console.log('Client wants to execute: ' + info.command);
        var stream = accept();
        var cmd = expCommand[0];
        var repo  = expCommand[1];
        // FIXME: Just a hack to make spawn work
        repo = repo.slice(1,-1);
        console.log(repo);
        var cmd = spawn(cmd,[repo]);
        stream.on('data',(data)=>{
          cmd.stdin.write(data);
        });
        cmd.stdout.on('data',(data)=>{
          stream.write(data);
        });
        cmd.stderr.on('data',(data)=>{
          stream.stderr.write(data);
        });
        cmd.on('exit',(code)=>{
          stream.exit(code);
          stream.end();
        });
      }else{
        var stream = accept();
        stream.stderr.write("This is not an SSH shell\n");
        stream.stderr.write("PLEASE USE IT ONLY FROM GIT\n");
        stream.exit(1);
        stream.end();
      }
    });
  });
}

module.exports = helper;
