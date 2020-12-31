var mongoose = require('mongoose').set('debug', true);
mongoose.connect('mongodb://localhost/sharath', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var userSchema = new mongoose.Schema({     // schema for users
  userId: String,
  firstName: String,
  lastName: String,
  emailAddress: String,
  address1: String,
  address2: String,
  city:String,
  state: String,
  zipCode: String,
  country: String
});
var User = mongoose.model('User', userSchema);
module.exports = User
