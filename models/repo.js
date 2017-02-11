const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var repoSchema = new Schema({
  title: {type: String,required: true},
  owner: {type: String, required: true},
  pub  : {type: Boolean,default: false},
  read : [{
    id : {type: String}
  }],
  write: [{
    id: {type: String}
  }]
});

module.exports = mongoose.model('repo',repoSchema);
