const inspect = require('util').inspect;
const spawn = require('child_process').spawn;
const user  = require('./user');
const repo  = require('./repo');

module.exports = function(client){
  this.client = client;
  this.authenticated = false;
  this.client.on('authentication',(ctx)=>{
    this.ctx = ctx;
    if(ctx.method === 'password'){
      ctx.reject();
    }else if (ctx.method === 'publickey'){
      ctx.accept();
    }else{
      ctx.reject();
    }
  });
  this.client.on('ready',(client)=>{
    this.client.on('session',(accept,reject)=>{
      this.session = accept();
      this.session.once('exec',(accept, reject, info)=>{
        var command = info.command;
        var expCommand = command.split(" ");
        if(expCommand[0] == 'git-upload-pack' || expCommand[0] == 'git-receive-pack'){
          var stream = accept();
          var cmd = expCommand[0];
          var repo  = expCommand[1];
          repo = repo.slice(1,-1);
          if(this.ctx.method === 'publickey'){
            //console.log(this.ctx.key.data.length);
            var atom = repo.split("/");
            var user = atom[1];
            atom = atom[2];
            atom = atom.split(".");
            var repo_name = atom[0];
            console.log("User :" +user);
            console.log("Repo :" +repo_name);
          }
          repo = process.env.GitBase+repo;
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
  });
}
