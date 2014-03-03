/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
var address = 'http://localhost:1337/user/verifyEmail/';

module.exports = {
    
   index: function(req, res){
   		//res.view('auth/login');
      res.view();
   },

   processLogin: function(req, res){
      console.log("processLogin req.body.username: "+req.body.username);
      console.log("processLogin req.body.email: "+req.body.email);    
      passport.authenticate('local', function(err, user, info) {
        console.log('processLogin user.email: '+user.email);
        console.log('processLogin user.username: '+user.username);
	      if ((err) || (!user)) {
	        /*return res.send({
	        message: 'login failed'
	        });*/
	        res.redirect('/login');
	        res.send(err);
	      }
	      req.logIn(user, function(err) {
	        if (err) res.send(err);
	        else{
		        res.redirect('/');
		    }
	      });
	    })(req, res);
  },
 
 
  'facebook': function (req, res, next) {
     passport.authenticate('facebook', { scope: ['email', 'user_about_me', 'user_birthday' ]},
      function (err, user) {
        console.log('user in facebook: '+user );
        req.logIn(user, function (err) {
        if(err) {
          console.log(err);
          req.view('500');
          return;
        }
        res.redirect('/');
        return;
      });
    })(req, res, next);
  },
  
  'facebook/callback': function (req, res, next) {
   passport.authenticate('facebook',
    function (err, user) {
      console.log('err message in facebook/callback: '+ err);
      console.log('user message in facebook/callback: '+ user.username);      
      //res.redirect('/');
      req.logIn(user, function(err) {
        if (err) res.send(err);
        else{
            res.redirect('/');
        }
      });
    })(req, res, next);
  },


  'google': function (req, res) {
    console.log('Login using google');
        passport.authenticate('google', {failureRedirect: '/auth/login',scope:['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email']},
            function (err, user) {
              console.log('google user authenticated');
                req.logIn(user, function (err) {
                    if (err) {
                        console.log(err);
                        res.view('500');
                        return;
                    }
                    res.redirect('/');
                    return;
                });
            })(req, res);
    },

    'google/callback': function (req, res, next) {
       passport.authenticate('google',
        function (err, user) {
          req.logIn(user, function(err) {
            if (err) res.send(err);
            else{
                res.redirect('/');
            }
          });
        })(req, res, next);
      },
   
   signup: function(req, res){
   		res.view('auth/signup');
   },
   
   processSignup: function(req, res){
    User.findOne({
      email: req.body.email
    }).done(function (err, usr){
        if(err || usr === undefined){
          generateRandomAlphaNumeric(60, function(randomToken){       
            var link = address+randomToken
            console.log("randomToken: "+randomToken);
            EmailService.sendInviteEmail({email: req.body.email, name: req.body.username, link: link});
            User.create({
              username: req.body.username,
              email: req.body.email,
              password: req.body.password,
              token: randomToken
              }).done(function (err, user) {
                if ( err ) {
                    return next(err);
                }
                else {
                  //res.redirect('/')
                    //res.json(user);
                    req.logIn(user, function(err) {
                      if (err) res.send(err);
                      else{
                        res.redirect('/');
                    }
                    });
                }
              });  
          });
        }
        else{
          res.send('User '+ req.body.email +' has already signed');
        }
    });
   },

   // For example, to update a user's name,
// .update(query, params to change, callback)

  emailVerified: function(req, res){
    console.log("req.param('token'): "+req.param('token'));
    User.update({
      token: req.param('token')
    },{
      emailVerified: true
    }, function(err, users) {
      if (err) {
        return console.log(err);
      } else {
        console.log("Email verified for user:", users);
        res.view('email/emailVerified');
      }
    });
  },

  logout: function (req, res) {
        req.logout();
        res.redirect('/login');
  }
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
   ,
  _config: {}  
};

/*module.exports.blueprints = {
 
  // Expose a route for every method,
  // e.g.
  // `/auth/foo` =&gt; `foo: function (req, res) {}`
  actions: true,
 
  // Expose a RESTful API, e.g.
  // `post /auth` =&gt; `create: function (req, res) {}`
  rest: true,
 
  // Expose simple CRUD shortcuts, e.g.
  // `/auth/create` =&gt; `create: function (req, res) {}`
  // (useful for prototyping)
  shortcuts: true
 
};*/

var generateRandomAlphaNumeric = function(length, callback){
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var randomString='';
    for(var i=0; i<length; i++){
      var rnum = Math.floor(Math.random() * chars.length);
      randomString = randomString+chars.substring(rnum,rnum+1);
    }
    callback(randomString);
};