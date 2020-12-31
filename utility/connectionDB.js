var Connection = require('../models/Connection.js');
var mongoose = require('mongoose').set('debug', true);
mongoose.connect('mongodb://localhost/sharath', {useNewUrlParser: true});
var Promise = require ('promise');
  module.exports.getConnection = function (ID){       // getConnection(ID) using promises
    return new Promise((resolve, reject)=>{
    Connection.find({connectionID:ID}, function(err, data){
      if(err){
        reject(err);
      }
      else{
        resolve(data);
      }
      });

      });
      }
  module.exports.getConnections = function(){        // getConnections() using promises
    return new Promise((resolve, reject)=>{
    Connection.find({}, function(err, data){
      if(err){
        reject(err);
      }
      else{
        resolve(data);
      }
      });

      });
      }
  module.exports.getCategories = function(){                // getCategories() using promises
    return new Promise((resolve, reject)=>{
    Connection.distinct('categoryName', function(err, data){
      if(err){
        reject(err);
      }
      else{
        resolve(data);
      }
      });

      });
      }
module.exports.getSize = function () {            // getSize()
    var data = Connection.count();
    return data;
 }
