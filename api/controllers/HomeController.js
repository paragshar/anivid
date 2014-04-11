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

"use strict";
var bcrypt = require('bcrypt');
var paypal_api = require('paypal-rest-sdk');

paypal_api.configure({
          'host': 'api.sandbox.paypal.com',
          'port': '',
          'client_id': 'ATsZkxBGMDqsLcrkZTsnE1hCv9R5vkO_4aTUMiOan2NdIC739_fkv0pT2nrf',
          'client_secret': 'ECP8jRA3UQsG9hrY1izXke_oYuS_ujcvaZvKm5G4UMPlLgIlI9zKlZj4kyn4' });

module.exports = {

    index: function (req,res){

        console.log("req.user: "+req.user);
        console.log("req.user.email: "+req.user.email);
        console.log("req.user.id: "+req.user.id);

        Vedio.find({email: req.user.email}).done(function (err, userVedios){
          console.log("userVedios: "+userVedios);
            res.view({
                user: req.user,
                vedio: userVedios
            });            
        });
    },

    pay: function(req, res){


      console.log("req.user: "+req.user);
      console.log("req.user.email: "+req.user.email);
      console.log("req.user.id: "+req.user.id);

      var create_payment_json = {
          "intent": "sale",
          "payer": {
              "payment_method": "paypal"
          },
          "redirect_urls": {
              "return_url": "http://localhost:1337/paymentDone",
              "cancel_url": "http://localhost:1337/"
          },
          "transactions": [{
              "amount": {
                  "currency": "USD",
                  "total": "2.00"
              },
              "description": "Ultimate Produce Full HD videos with no watermark. ($599/year)"
          }]
      }; 
      paypal_api.payment.create(create_payment_json, function (err, payment) {
          if (err) {
              throw err;
          }
          if (payment) {
              req.session.paymentId = payment.id;
              var link = payment.links[1].href;
              res.redirect(link);
          }
      });
    },

    paymentDone: function(req, res){

      var paymentId = req.session.paymentId;
      var payerId = req.param('PayerID');
      var details = { "payer_id": payerId };
      paypal_api.payment.execute(paymentId, details, function (error, payment) {
        console.log('payment: '+ payment);
        if (error) {
          res.send(error);
        } 
        else 
        {
          console.log('Updating plan for user with email: '+req.user.email);
          Order.findOne({email: req.user.email}).done(function (err, order){
                if(!order){
                      console.log('Updating plan for the first time');
                      Order.create({
                      email: req.user.email,
                      paymentId: paymentId,
                      plan: 'upgraded'

                    }).done(function(err, order){
                      if(err){
                          console.log('err: '+err);
                      }
                      else{
                          console.log('order: '+ order);
                      }
                    });
                }
                else{
                    console.log('Updating plan for the second time');
                    Order.update({email: req.user.email},{
                      plan: 'upgraded second time'
                      }, function(err, order) {
                      if (err) {
                          return console.log(err);
                      } else {
                          console.log("Upgraded order plan:", order);
                          res.send(order);
                      }
                    });
                }
          });
                

          //res.send("Payment has been done!");
                res.redirect('/');
        }
      });
    },

    deleteVedio: function(req, res){
        console.log('deleting vedio with id: '+req.param('id'));
        Vedio.findOne(req.param('id')).done(function(err, vedio) {
          vedio.destroy(function(err) {
          });
          res.redirect('/');
        });
    },

    'account-settings': function(req, res){
        //res.view('home/account-settings');
        Order.findOne({email: req.user.email}).done(function (err, userOrder){
          console.log("userOrder: "+userOrder);
          res.view({
            user: req.user,
            order: userOrder
          });            
        });
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
                                            res.redirect('/account');
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

    
   'start-video': function (req, res){
      res.view({
        user: req.user
      });
   },
   'video/app/index': function (req, res){
      res.view();
   },
    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to AuthController)
     */
    _config: {}
};