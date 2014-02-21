var assert = require('assert')
  , Sails = require('sails')
  , barrels = require('barrels')
  , fixtures;
var request = require('supertest');

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



/*describe('Users', function() {
  describe('#list()', function() {
    it ('Atleast one user is present', function() {
      User.find(function(err, users) {
        console.log(users.length);
        var numberOfUsers = users.length > 0;
        assert(numberOfUsers, 'There should be some users');
      });
    });
  });
});*/



describe('BasicUser', function(done) {
  it("should be able to create", function(done) {
    User.create({username: "hee", email: "a@b.c", password: "xaooiin"}, function(err, user) {
      assert.notEqual(user, undefined);
      done();
    });
  });
});


describe('Routes', function(done) {
  it('GET / should return 200', function (done) {
    request(Sails.express.app).get('/').expect(200, done);
  });
});

describe('Routes', function(done) {
  it('GET /home should return 302', function (done) {
    request(Sails.express.app).get('/home').expect(302, done);
  });
});

describe('Routes', function(done) {
  it('GET /signup should return 200', function (done) {
    request(Sails.express.app).get('/signup').expect(200, done);
  });
});


describe('Routes', function(done) {
  it('GET /processSignup should return 200', function (done) {
    request(Sails.express.app).get('/').expect(200, done);
  });
});


describe('Routes', function(done) {
  it('GET /login should return 200', function (done) {
    request(Sails.express.app).get('/login').expect(200, done);
  });
});

describe('Routes', function(done) {
  it('GET /processLogin should return 302', function (done) {
    request(Sails.express.app).get('/processLogin').expect(302, done);
  });
});

// Global after hook
after(function (done) {
  console.log();
  sails.lower(done);
});