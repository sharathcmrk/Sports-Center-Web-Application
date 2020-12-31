var mongoose = require('mongoose').set('debug', true);
mongoose.connect('mongodb://localhost/sharath', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var userConnSchema = new mongoose.Schema({      // schema for userprofile
  userId: String,
  Uid: String,
  event: String,
  category: String,
  rsvp: String
});
var Userconnection = mongoose.model('Userconnection', userConnSchema);


module.exports = Userconnection;    //exporting UserProfile class to use in other files.
