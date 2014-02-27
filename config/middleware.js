 var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt')
 ,  FacebookStrategy = require('passport-facebook').Strategy
 ,  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

function findById(id, fn) {
  User.findOne(id).done(function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}
 
function findByUsername(u, fn) {
  User.findOne({
    username: u
  }).done(function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}

function findByEmail(u, fn) {
  User.findOne({
    email: u
  }).done(function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}


var verifyHandler = function (token, tokenSecret, profile, done) {
    process.nextTick(function () {
        console.log('FindOrCreate user with id: '+ profile.id);
        User.findOne(profile.id).done(function (err, user) {
                if (user) {
                    console.log( profile.displayName+ ' has previously registered with '+ profile.provider );
                    return done(null, user);
                } else {

                    var data = {
                        _id: profile.id,
                        username: profile.displayName,
                        password: 'superSecretPassword'
                    };

                    if(profile.emails && profile.emails[0] && profile.emails[0].value) {
                        data.email = profile.emails[0].value;
                    }
                    console.log('profile: '+profile);
                    console.log('profile.id: '+profile.id);
                    console.log('profile.displayName: '+profile.displayName);
                    console.log('profile.emails[0].value: '+profile.emails[0].value);
                    User.create(data).done(function (err, user) {
                            console.log(profile.provider+' User object is created for '+profile.displayName);
                            return done(err, user);
                        });
                }
            });
    });
};

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function (user, done) {
  done(null, user.id);findByUsername
});
 
passport.deserializeUser(function (id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});



module.exports = {
  express: {
    customMiddleware: function(app){
      console.log('Express middleware for passport');

        passport.use(new LocalStrategy(
          function (email, password, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {
              findByEmail(email, function (err, user) {
                if (err)
                  return done(null, err);
                if (!user) {
                  return done(null, false, {
                    message: 'Unknown user ' + username
                  });
                }
                bcrypt.compare(password, user.password, function (err, res) {
                  if (!res)
                    return done(null, false, {
                      message: 'Invalid Password'
                    });
                  var returnUser = {
                    email: user.email,
                    createdAt: user.createdAt,
                    id: user.id
                  };
                  return done(null, returnUser, {
                    message: 'Logged In Successfully'
                  });
                });
              })
            });
          }
        ));

        passport.use(new FacebookStrategy({
            clientID: 521820967934931,
            clientSecret: '6483c72e8e828af9143560943b43b829',
            callbackURL: "http://localhost:1337/auth/facebook/callback"
          },
          verifyHandler
        ));

        passport.use(new GoogleStrategy({
            clientID: '795485685106-89ordkdo6pfnp916tpd12eis78oh6qe3.apps.googleusercontent.com',
            clientSecret: 'gBUTiHHb1UqKNIuk-3MIDPoG',
            callbackURL: "http://localhost:1337/auth/google/callback"
          },
          verifyHandler
        ));

      app.use(passport.initialize());
      app.use(passport.session());
    }
  }
};