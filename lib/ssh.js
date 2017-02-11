const inspect = require('util').inspect;
const spawn = require('child_process').spawn;
const user  = require('./user');
const repoHelper  = require('./repo');

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
      this.session = accept(); this.session.once('exec',(accept, reject, info)=>{
        var command = info.command;
        var expCommand = command.split(" ");
        if(expCommand[0] == 'git-upload-pack' || expCommand[0] == 'git-receive-pack'){
          var stream = accept();
          var cmd = expCommand[0];
          var repo  = expCommand[1];
          repo = repo.slice(1,-1);
          repoHelper['hasAccess']({ctx:this.ctx,repo:repo,cmd:cmd})
          .then(()=>{
            var repoPath = process.env.GitBase+repo;
            var cmd = spawn(expCommand[0],[repoPath]);
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
          })
          .catch((err)=>{
            stream.stderr.write(err.message+"\n");
            stream.exit(1);
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
