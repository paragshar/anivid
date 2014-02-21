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

module.exports = {
    
   home: function(req, res){
        console.log("req.user: "+(req.isAuthenticated()));
   		if(req.isAuthenticated()){
			res.view('home/home');
		}
		else{
			res.redirect('/login');
		}  		
   },

   login: function(req, res){
   		res.view('auth/login');
   },
   processLogin: function(req, res){
	    passport.authenticate('local', function(err, user, info) {
	      if ((err) || (!user)) {
	        /*return res.send({
	        message: 'login failed'
	        });*/
	        res.redirect('/login');
	        res.send(err);
	      }
	      req.logIn(user, function(err) {
	        if (err) res.send(err);
	        /*return res.send({
	          message: 'login successful'
	        });*/
	       else{
		        res.redirect('/home');
		    }
	      });
	    })(req, res);
  },
   
   signup: function(req, res){
   		res.view('auth/signup');
   },
   
   processSignup: function(req, res){
   		User.create(req.params.all()).done(function (err, user) {
	        if ( err ) {
	            return next(err);
	        }
	        else {
	        	res.redirect('/home')
	            //res.json(user);
	        }
    	});
   }

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
 // _config: {}

  
};


module.exports.blueprints = {
 
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
 
};