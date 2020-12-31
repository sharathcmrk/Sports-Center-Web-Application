var User = require('../models/User');
var mongoose = require('mongoose').set('debug', true);
mongoose.connect('mongodb://localhost/sharath', {useNewUrlParser: true});
var db = mongoose.connection;
var Promise = require ('promise');
module.exports.getUser = function(ID){          // getUser(userId) for getting user details using promises
  return new Promise((resolve, reject)=>{
  User.find({userId:ID}, function(err, data){
    if(err){
      reject(err);
    }
    else{
      resolve(data);
    }
  });

});
}
