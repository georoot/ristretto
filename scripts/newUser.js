require('dotenv').config();
const mongoose = require('mongoose');
const chalk = require('chalk');
const prompt = require('prompt');
mongoose.connect('mongodb://'+process.env.DbHost+'/'+process.env.DbName);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
const helper = require('../lib/user');


console.log(chalk.red.bold("Create new git user"));
prompt.start();

prompt.get([{
    name: 'username',
    required: true
  }, {
    name: 'password',
    hidden: true,
    replace: '*',
    conform: function (value) {
    return true;
    }
  }], function (err, result) {
    result.role = "admin";
    helper['hashPassword'](result)
      .then(helper['save'])
      .then(()=>{
        console.log(chalk.green("New user created"));
        process.exit(0);
      })
      .catch((err)=>{
        console.log(chalk.red(err.message));
        process.exit(1);
      });
  });
