var mongoose = require('mongoose').set('debug', true);
mongoose.connect('mongodb://localhost/sharath', {useNewUrlParser: true});
var Userconnection = require('../models/UserProfile');
var Usercredential = require('../models/UserCredentials.js');
var Connection = require('../models/Connection');
var Promise = require('promise');
module.exports.getUserProfile = function(ID){     // getUserProfile(userId) to get userconnections
  var user = Userconnection.find({userId:ID});
  return user;
}
module.exports.validateCredential = function(username){      //validateCredential(username) to verify username present in db
  var user = Usercredential.find({userName: username});
  return user;
}

module.exports.addRSVP = function(data){            // addRSVP() to add connection and RSVP to userconnections collection
  Userconnection.insertMany(data, function(err,docs){
      if(err) throw err;
   });
}

module.exports.updateRSVP = function(userId, Uid, event, category, rsvp){  // updateRSVP() to modify RSVP in userconnections collection
  Userconnection.findOneAndUpdate({userId: userId, Uid: Uid, event:event,category:category}, {rsvp: rsvp}, {upsert: true, new: true}).exec(function(err, docs){
  if(err) throw err;
});
}

module.exports.addConnection = function(data) {       //addConnection to add validated newconnection to db
  return new Promise((resolve, reject)=>{
  Connection.insertMany(data,function(err, docs){
    if(err){
      reject(err);
    }
    else{
      resolve(docs);
    }
    });
    });
    }
