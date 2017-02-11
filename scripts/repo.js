require('dotenv').config();
const mongoose = require('mongoose');
const chalk = require('chalk');
const prompt = require('prompt');
mongoose.connect('mongodb://'+process.env.DbHost+'/'+process.env.DbName);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
const userHelper = require('../lib/user');
const repoHelper = require('../lib/repo');

console.log(chalk.red.bold("Create new repository"));

prompt.start();

prompt.get([{
    name: 'username',
    required: true
  }, {
    name: 'repoName',
    required: true
  }], function (err, result) {
    userHelper.findOne(result)
      .then(repoHelper['createRepo'])
      .then((data)=>{
        console.log(chalk.green("New repository created"));
        process.exit(0);
      })
      .catch((err)=>{
        console.log(chalk.red(err.message));
        process.exit(1);
      });

  });
