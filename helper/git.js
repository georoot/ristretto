const git = require('simple-git');

module.exports = function(username,repo){
  this.username = username;
  this.repo     = repo;
  this.git = new git(process.env.GitBase+"/"+username+"/"+repo+".git");

  this.init = ()=>{
    this.git.init(true,()=>{
    });
  }
};
