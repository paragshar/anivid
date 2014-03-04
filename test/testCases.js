var assert = require('assert')
  , Sails = require('sails')
  , barrels = require('barrels')
  , fixtures;
var request = require('supertest');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ********************LIFTS SAILS*****************************
// Global before hook
before(function (done) {
  // Lift Sails with test database
  Sails.lift({
    log: {
      level: 'error'
    },
    adapters: {
      default: 'disk'
    }
  }, function(err, sails) {
    if (err)
      return done(err);
    // Load fixtures
    barrels.populate(function(err) {
      done(err, sails);
    });
    // Save original objects in `fixtures` variable
    fixtures = barrels.objects;
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ****************TEST CASES ON USER OBJECT********************
describe('Create User', function(done) {
  it("should be able to create a user", function(done) {
    User.create({username: "Deepanshu Singh", email: "deepanshu@mantralabsglobal.com", password: "supersecretpassword"}, function(err, user) {
      assert.notEqual(user, undefined);
      done();
    });
  });
});

describe('Find User', function(done) {
  it("should be able to find a user", function(done) {
    User.findOne({email: "deepanshu@mantralabsglobal.com"}, function(err, user) {
      assert.notEqual(user, undefined);
      done();
    });
  });
});

describe('Verify User Details in DB', function(done) {
  it("should have same user data in db as provided", function(done) {
    User.findOne({email: "deepanshu@mantralabsglobal.com"}).done(function(err, user){
      assert.equal(user.email, 'deepanshu@mantralabsglobal.com');
      assert.equal(user.username, 'Deepanshu Singh');
      done();
    });
  });
});

describe('User Password is Encrypted', function(done) {
  it("should have encrypted the password while storing", function(done) {
    User.findOne({email: "deepanshu@mantralabsglobal.com"}).done(function(err, user){
      assert.notEqual(user.password, 'supersecretpassword');
      done();
    });
  });
});

describe('Delete User', function(done) {
  it("should be able to delete a user", function(done) {
    User.findOne({email: "deepanshu@mantralabsglobal.com"}).done(function(err, user){
      user.destroy(function(err){
        assert.equal(err, null);
        done();
      });
    });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// ****************TEST CASES ON ROUTES********************
describe('Routes /', function(done) {
  it('GET / should return 302', function (done) {
    request(Sails.express.app).get('/').expect(302, done);
  });
});

/*describe('Routes GET /signup', function(done) {
  it('GET /signup should return 200', function (done) {
    request(Sails.express.app).get('/signup').expect(200, done);
  });
});


// next is not defined 
describe('Routes POST /signup', function(done) {
  it('POST /signup should return 302', function (done) {
    request(Sails.express.app).post('/').expect(302, done);
  });
});*/


describe('Routes GET /login', function(done) {
  it('GET /login should return 200', function (done) {
    request(Sails.express.app).get('/login').expect(200, done);
  });
});

describe('Routes POST /login', function(done) {
  it('POST /login should return 302', function (done) {
    request(Sails.express.app).post('/login').expect(302, done);
  });
});

describe('Routes /auth/facebook', function(done) {
  it('/auth/facebook should return 302', function (done) {
    request(Sails.express.app).post('/auth/facebook').expect(302, done);
  });
});

describe('Routes /auth/facebook/callback', function(done) {
  it('/auth/facebook/callback should return 302', function (done) {
    request(Sails.express.app).post('/auth/facebook/callback').expect(302, done);
  });
});

describe('Routes /auth/google', function(done) {
  it('/auth/google should return 302', function (done) {
    request(Sails.express.app).post('/auth/google').expect(302, done);
  });
});

describe('Routes /auth/google/callback', function(done) {
  it('/auth/google/callback should return 302', function (done) {
    request(Sails.express.app).post('/auth/google/callback').expect(302, done);
  });
});

describe('Routes /user/verifyEmail/:token', function(done) {
  it('/user/verifyEmail/:token should return 200', function (done) {
    request(Sails.express.app).post('/user/verifyEmail/bkjbjhb89iubijhvvbiv8vuuvyv').expect(200, done);
  });
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////
//************************LOWERING SAILS************************
// Global after hook
after(function (done) {
  console.log();
  sails.lower(done);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////