/**
 * HomeController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
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

var bcrypt = require('bcrypt');

module.exports = {

    index: function (req,res)    {
        console.log("req.user: "+req.user);
        console.log("req.user.email: "+req.user.email);
        console.log("req.session.user: "+req.session.user);
        res.view({
            user: req.user
        });
    },

    account: function(req, res){
        res.view('home/account-settings');
    },

    viewProfile: function(req, res){
        res.send(req.user);
    },

    updateProfile: function(req, res){
        console.log('update user profile for user id: '+req.user.id);
        User.update(req.user.id,{
            username: 'req.body.username'
            }, function(err, user) {
            if (err) {
                return console.log(err);
            } else {
                console.log("Updated user profile:", user);
                res.send(user);
            }
        });
    },

    updatePassword: function(req, res){
        //req.body.oldpassword = 'deepanshu';
        // finds a user who is loggedin
        User.findOne(req.user.id).done(function (err, user){
                // compare the old password with the one he/she enters
                bcrypt.compare(req.body.existingPassword, user.password, function (err, flag) {
                  if (!flag){   
                    res.send('old password does not match with that in database');
                  }
                  else{
                        //user.password = 'deep';
                        user.password = req.body.newPassword;
                        var newPassword;
                        bcrypt.genSalt(10, function(err, salt) {
                          bcrypt.hash(user.password, salt, function(err, hash) {
                            if (err) {
                                console.log('error while hashinng');
                              console.log(err);
                            }else{
                                  console.log('hashhhhhhhh: '+ hash);
                                  newPassword = hash;
                                  user.password = hash;

                                  User.update(req.user.id,{
                                        password: newPassword
                                        }, function(err, user) {
                                        if (err) {
                                            return console.log(err);
                                        } else {
                                            console.log("Updated user profile:", user);
                                            res.send(user);
                                        }
                                    });
                            }
                          });
                        });
                  }
                  //return done(null, user);
                });
        });
    },
    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to AuthController)
     */
    _config: {}
};
