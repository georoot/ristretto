const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objId  = Schema.ObjectId;

var repoSchema = new Schema({
  title: {type: String,required: true},
  owner: {type: String, required: true},
  pub  : {type: Boolean,default: false},
  admin: {type: Array},
  read : {type: Array},
  write: {type: Array}
});

module.exports = mongoose.model('repo',repoSchema);
