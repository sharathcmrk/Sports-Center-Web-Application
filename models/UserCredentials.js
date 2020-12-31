var mongoose = require('mongoose').set('debug', true);
mongoose.connect('mongodb://localhost/sharath', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var userSchema = new mongoose.Schema({    // schema for usercredential
  userId: String,
  userName: String,
  password: String
});
var Usercredential = mongoose.model('Usercredential', userSchema);
module.exports = Usercredential
