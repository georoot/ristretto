const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {type: String, required: true,index: {unique: true, dropDups: true}},
  password: {type: String, required: true},
  role    : {type: String, required: true},
  keys    : [{
    value : {type: String},
    title : {type: String}
  }]
});

module.exports = mongoose.model('user',userSchema);
