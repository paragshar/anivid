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


describe('BasicUser', function(done) {
  it("should be able to create", function(done) {
    User.create({username: "hee", email: "a@b.c", password: "xaooiin"}, function(err, user) {
      assert.notEqual(user, undefined);
      done();
    });
  });
});


describe('Routes', function(done) {
  it('GET / should return 302', function (done) {
    request(Sails.express.app).get('/').expect(302, done);
  });
});

/*describe('Routes', function(done) {
  it('GET /home should return 302', function (done) {
    request(Sails.express.app).get('/home').expect(302, done);
  });
});*/

describe('Routes', function(done) {
  it('GET /auth/signup should return 200', function (done) {
    request(Sails.express.app).get('/auth/signup').expect(200, done);
  });
});


describe('Routes', function(done) {
  it('POST /auth/signup should return 302', function (done) {
    request(Sails.express.app).post('/').expect(302, done);
  });
});


describe('Routes', function(done) {
  it('GET /auth/login should return 200', function (done) {
    request(Sails.express.app).get('/auth/login').expect(200, done);
  });
});

describe('Routes', function(done) {
  it('POST /auth/login should return 302', function (done) {
    request(Sails.express.app).post('/auth/login').expect(302, done);
  });
});


// Global after hook
after(function (done) {
  console.log();
  sails.lower(done);
});