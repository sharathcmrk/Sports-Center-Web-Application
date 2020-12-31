var express = require('express');
var router = express.Router();
var app = express();
var bodyparser = require('body-parser');
var urlencoded = bodyparser.urlencoded({ extended: false });
const { check, validationResult } = require('express-validator');
var connectionDB = require('../utility/connectionDB.js');              // requiring all necessary packages
var Promise = require ('promise');
var UserDb = require('../utility/userDB.js')
var User = require('../models/User');
var Userconnection = require('../models/UserProfile');
var UserconnectionDb = require('../utility/userProfileDB.js');
var Usercredential = require('../models/UserCredentials.js');
var Userpro = require('../models/UserObject.js');
var Userconn = require('../models/UserConnectionObject.js');           // requiring all utility modules and object models
var mongoose = require('mongoose').set('debug', true);
mongoose.connect('mongodb://localhost/sharath', {useNewUrlParser: true});  // requiring mongoose
mongoose.Promise = global.Promise;

router.get('/', function(req, res){
  if (req.session.UserProfile){                                     // checking if session exists
    var user = UserDb.getUser(req.session.UserProfile._userId);     // if exists get user details using userId
    user.then(function(users){
    var name = users[0].firstName;
    res.render('index', { loggedIn: true, Name: name })
  }).catch(function(err) {
      console.log('Caught an error while getting user details!');
    });
}
else {
  res.render('index', { loggedIn: false, Name: '' });               // if session doesn't exist then send name as empty string
}

});

router.get('/index', function(req, res){                // same for '/index'
  if (req.session.UserProfile){
    var user = UserDb.getUser(req.session.UserProfile._userId);
    user.then(function(users){
    var name = users[0].firstName;
    res.render('index', { loggedIn: true, Name: name })
  }).catch(function(err) {
      console.log('Caught an error while getting user details!');
    });
}
  else {
  res.render('index', { loggedIn: false, Name: '' });
}

});

router.get('/connections', function(req, res){
  if (req.session.UserProfile){
  var data = connectionDB.getConnections();             // getting all connections
  data.then(function(connections){
  var category = connectionDB.getCategories();          // getting categories of all connections
  category.then(function(categoryName){
  var user = UserDb.getUser(req.session.UserProfile._userId);
  user.then(function(users){
    var data = connections;
    var category = categoryName;
    var name = users[0].firstName;
    res.render('connections', { data: data, category: category, loggedIn: true, Name: name}); // sending categories, connections for rendering
  }).catch(function(err) {
    console.log('Caught an error while getting user details!');
  });
}).catch(function(err) {
    console.log('Caught an error while getting categories!');
  });
}).catch(function(err) {
    console.log('Caught an error while getting connections!');
  });

}
else {
  var data = connectionDB.getConnections();
  data.then(function(connections){
    var category = connectionDB.getCategories();
    category.then(function(categoryName){
    var data = connections;
    var category = categoryName;
    res.render('connections', { data: data, category: category, loggedIn: false, Name: ''});
  }).catch(function(err) {
    console.log('Caught an error while getting categories!');
  });
  }).catch(function(err) {
    console.log('Caught an error while getting connections!');
  });
}
});

router.get('/connection/:ID',[check('ID','Invalid ID').isNumeric().toInt()], function(req, res){  // checking parameter ID whether it is Numeric or not

  const errors = validationResult(req);     // Validating req
  if (!errors.isEmpty()) {
  return res.send(errors.errors);          // if errors are not empty JSON will be displayed showing location and message
  }
  if (req.session.UserProfile){
  var user = UserDb.getUser(req.session.UserProfile._userId);
  user.then(function(users){
  var name = users[0].firstName;
  var con = connectionDB.getConnection(req.params.ID);      // getting connection using ID
  con.then(function(connection){
    var size = connectionDB.getSize().exec();              // getting size of connections in DB
    size.then(function(d){
  if (connection!=null && req.params.ID <= d) {            // if connection is not null and ID is less than or equal to size
    res.render('connection', {data: connection[0], Uid: req.params.ID, loggedIn: true, Name: name}); // then render appropriate connection
    }
  else{                                                    // if ID is greater than the size or connection is null then render connections
    res.redirect('/connections');
  }
}).catch(function(err) {
    console.log('Caught an error while getting size!');
  });
  }).catch(function(err) {
      console.log('Caught an error while getting conections!');
    });                                                                 // catching errors
}).catch(function(err) {
    console.log('Caught an error while getting user details!');
  });
}
  else{                                                                       // if not loggedIn
    var con = connectionDB.getConnection(req.params.ID);
    con.then(function(connection){
        var size = connectionDB.getSize().exec();
        size.then(function(d){
    if (connection!=null && req.params.ID <= d) {
      res.render('connection', {data:connection[0], Uid: req.params.ID, loggedIn: false, Name: '' })
      }
      else{
          res.redirect('/connections');
      }
    }).catch(function(err) {
        console.log('Caught an error while getting size!');
      });
    }).catch(function(err) {
        console.log('Caught an error getting conections!');
      });
  }
});

router.get('/savedconnections', function(req, res){
  if(req.session.UserProfile){
  if (req.session.UserProfile._userConnections.length > 0  ){            // if userconnections in session is not empty
    var user = UserDb.getUser(req.session.UserProfile._userId);
    user.then(function(users){
    var name = users[0].firstName;
  res.render('savedconnections', { data: req.session.UserProfile._userConnections , connectionsExist: true, loggedIn: true, Name: name }); // renders table of userconnections
}).catch(function(err) {
    console.log('Caught an error  while getting user details!');
  });
}
else {                                                            // if userconnections are empty then connectionsExist is set to False
  var user = UserDb.getUser(req.session.UserProfile._userId);
  user.then(function(users){
  var name = users[0].firstName;
  res.render('savedconnections', { data: req.session.UserProfile._userConnections , connectionsExist: false, loggedIn: true, Name: name }); // renders message 'No events registered'
}).catch(function(err) {
    console.log('Caught an error  while getting user details!');
  });
}
}
else{
res.redirect('/login');    // if not loggeIn then render login page
}
});

router.post('/savedconnections', urlencoded, [check('Uid', 'Invalid Uid').isAlphanumeric().toInt(), // checking  Uid, event, categoryName, RSVP, actionOp
check('event', 'Invalid event' ).escape().trim(), check('categoryName', 'Invalid categoryName' ).isAlpha(),
check('button', 'Invalid RSVP' ).isAlpha(), check('actionOp', 'Invalid action' ).isAlpha()], function (req, res){
  const errors = validationResult(req);    // Validating all those req.body that are being sent when posted
  if (!errors.isEmpty()) {
  return res.send(errors.errors);     // If errors then JSON will be displayed
  }
  switch (req.body.actionOp) {        // action on press is sent hidden which is used to switch cases


      case "add":                     // when action on press is 'add'
      var search= [{
        userId: req.session.UserProfile._userId,
        Uid: req.body.Uid,
        event: req.body.event,
        category: req.body.categoryName
      }];
      Userconnection.find(search[0], function(err, docs){ //  search in userconnections collection in data base
        if(err){                                    // if no such document exists then add to the collection
          var data = [
            {
            userId: req.session.UserProfile._userId,
            Uid: req.body.Uid,
            event: req.body.event,
            category: req.body.categoryName,
            rsvp: req.body.button
          }];
          UserconnectionDb.addRSVP(data[0]);  // addRSVP function from userProfileDB module
        }
        else{                        // if document exists then update the document with new RSVP

          UserconnectionDb.updateRSVP(req.session.UserProfile._userId, req.body.Uid, req.body.event, req.body.categoryName, req.body.button); // updateRSVP function from userProfileDB module
}
      });
      var myconnections = getUserConn(req.session.UserProfile); // get userconnections from session
      var userConnection = new Userconn (req.body.Uid, req.body.event, req.body.categoryName, req.body.button);
      myconnections.addconnection(userConnection);  // addconnection if not exists
      myconnections.updateconnection(req.body.Uid, req.body.button);  // updateconnection if already exists
      req.session.UserProfile = myconnections; // send it to session after adding or updating
      console.log(req.session.UserProfile._userConnections);
      res.redirect('/savedconnections');
      break;
      case "delete":
      var connection = req.body.Uid;
      Userconnection.deleteOne({Uid:connection}).exec(function(err, docs){  // if document exists in collection then delete
      if(err) throw err;
    });
      var myconnections = getUserConn(req.session.UserProfile);
      myconnections.removeconnection(req.body.Uid);
      req.session.UserProfile = myconnections; // send the modified userconnections list to session afeter deleting
      console.log(req.session.UserProfile);
      res.redirect('/savedconnections');
      break;

};
});

router.get('/login', function(req, res){
  if (req.session.UserProfile){

    res.redirect('savedconnections');  // if loggedIn redirect to savedconnections

  }
  else{
    res.render('login', { loggedIn: false, Name: '', errors: '', crederr: ""  }); // if not loggedIn then render login page
  }
});
router.post('/login', urlencoded, [check('username', 'Invalid username or password').isEmail().normalizeEmail(),
check('password', 'Invalid username or password' ).isLength({min:8})], function(req, res){ // checking if username and paswword are valid

const errors = validationResult(req); // validating requests
if (!errors.isEmpty()) {
return res.render('login', { loggedIn: false, Name: '', errors: "Invalid username or password",  crederr: ""  }); // if errors is not empty then dispaly message
}
var cred = UserconnectionDb.validateCredential(req.body.username).exec();  // validateCredential function to check if usename exists
cred.then(function(docs){
  console.log(docs);
if(docs.length>0 && docs[0].password== req.body.password.toString()){ // if username exists then search for password in the document and check whether password submitted matches it
  var id = docs[0].userId;
  var user = UserDb.getUser(id);
  user.then(function(users){
  var name = users[0].firstName;
  var usercon = UserconnectionDb.getUserProfile(id).exec();
  usercon.then(function(userconn){
  var d = userconn;
  var u = [];
  d.forEach(function(con){
  var tmp = new Userconn(con.Uid, con.event, con.category, con.rsvp);
   u.push(tmp);
  });
  var userpro = new Userpro(users[0].userId, u);   // userprofile has keys userId and userconnections from db
  req.session.UserProfile = userpro;    // session starts and has userprofile data in it
  console.log(req.session.UserProfile);
  res.redirect('savedconnections');
}).catch(function(err) {
    console.log('Caught an error while getting userprofile!');
  });
}).catch(function(err) {
    console.log('Caught an error while getting user details!');
  });
}
else{          // if username or password is incorrect
    res.render('login', { loggedIn: false, Name: '', errors: "", crederr: "Incorrect username or password" });
}
});
});


router.get('/signout', function (req, res) {
    req.session.destroy(function (err) {   // signout destroys session
        if (err) {
            return next(err);
        } else {
            return res.redirect('/'); // then redirect to index page

        }
    });
});

router.get('/newconnection', function(req, res){
  if (req.session.UserProfile){
    var user = UserDb.getUser(req.session.UserProfile._userId);
    user.then(function(users){
    var name = users[0].firstName;
    res.render('newconnection', { loggedIn: true, Name: name, errors: "" } );
  }).catch(function(err) {
      console.log('Caught an error while getting user details!');
    });
  }
  else{
    res.render('newconnection', { loggedIn: false, Name: '', errors: "" } )
  }
});

router.post('/newconnection', urlencoded, [check('event','Please enter valid event name').isAlpha(),
check('company').isAlpha().withMessage('Please enter valid company name').trim(),
check('categoryName').isAlpha().withMessage('Please enter valid category name').trim(),
check('details').isAlpha().withMessage('Please enter valid details'),
check('where').isAlphanumeric().withMessage('Please enter valid location'),
check('when').isAlphanumeric().withMessage('Please enter valid day')], function(req,res){ // checking if user input is valid or not
  const errors = validationResult(req);      // validating requests
  if (!errors.isEmpty()) {          // if errors is not empty then show errors in the newconnection page
    if (req.session.UserProfile){
      var user = UserDb.getUser(req.session.UserProfile._userId);
      user.then(function(users){
      var name = users[0].firstName;
    return  res.render('newconnection', { loggedIn: true, Name: name, errors: errors.errors } );
    }).catch(function(err) {
        console.log('Caught an error while getting user details!');
      });
    }
    else{
    return res.render('newconnection', { loggedIn: false, Name: '', errors: errors.errors } );
    }
  }
  else{
  var con = connectionDB.getSize().exec();
  con.then(function(d){
  var connectionID = d+1;    // automatically sets connectionID to size + 1
  var data = [
    {
    connectionID: connectionID.toString(),
    event: req.body.event,
    host:  "Someone",
    categoryName: req.body.categoryName,
    company: req.body.company,
    details: req.body.details,
    when: req.body.when,
    time: "12:30PM to 5PM",
    where:  req.body.where,
    imageURL: "../assets/images/temp.jpg"

  }];
//console.log(data);
UserconnectionDb.addConnection(data[0]).then(function(data){ // if successfully added without errors then redirect to connections
res.redirect('/connections');
}).catch(function(err) {
    console.log('Caught an error while adding connection!');
  });
}).catch(function(err) {
    console.log('Caught an error while getting size!');
  });
}
});

router.get('/about', function(req, res){     // about
  if (req.session.UserProfile){
    var user = UserDb.getUser(req.session.UserProfile._userId);
    user.then(function(users){
    var name = users[0].firstName;
  res.render('about', { loggedIn: true, Name: name } );
}).catch(function(err) {
    console.log('Caught an error while getting user details!');
  });
}
else{
  res.render('about', { loggedIn: false, Name: '' } )
}
});

router.get('/contact', function(req, res){        // contact
  if (req.session.UserProfile){
    var user = UserDb.getUser(req.session.UserProfile._userId);
    user.then(function(users){
    var name = users[0].firstName;
  res.render('contact', { loggedIn: true, Name: name });
}).catch(function(err) {
    console.log('Caught an error while getting user details!');
  });
}
else{
  res.render('contact', { loggedIn: false, Name: '' })
}
});

router.get('*', function(req, res){
  res.send('error')
});

    var getUserConn = function (userprofile) { // getting userconnections
        var userID = userprofile._userId;
        var userConnections = userprofile._userConnections;
        var uis = [];
        for (var i = 0; i < userConnections.length; i++) {
            var temp = new Userconn(userConnections[i]._Uid, userConnections[i]._event, userConnections[i]._category, userConnections[i]._rsvp);
            uis.push(temp);
        }
        var userpro = new Userpro(userID, uis);
        return userpro;
    };
module.exports = router;
