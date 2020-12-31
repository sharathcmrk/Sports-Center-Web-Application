var mongoose = require('mongoose').set('debug', true);
mongoose.connect('mongodb://localhost/sharath', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var connectionSchema = new mongoose.Schema({     // schema for connections
  connectionID: String,
  event: String,
  host: String,
  categoryName: String,
  company: String,
  details: String,
  when: String,
  time: String,
  where: String,
  imageURL: String
});
var Connection = mongoose.model('Connection', connectionSchema);
module.exports = Connection;
