var assert = require('assert')
  , Sails = require('sails')
  , barrels = require('barrels')
  , fixtures;

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

// Global after hook
after(function (done) {
  console.log();
  sails.lower(done);
});

// Here goes a module test
describe('Users', function() {
  describe('#list()', function() {
    it ('Atleast one user is present', function() {
      // All apples
      User.find(function(err, users) {
        console.log(users.length);
        var numberOfUsers = users.length > 0;
        assert(numberOfUsers, 'There should be some users');
        /*var gotApples = (fixtures['users'].length > 0);
        var applesAreInTheDb = (users.length === fixtures['users'].length);
        assert(gotApples&&applesAreInTheDb, 'There must be something!');*/

        // All oranges
        /*Oranges.find(function(err, oranges) {
          assert.equal(apples.length, oranges.length,
            'The amount of varieties of apples and oranges should be equal!');
        });*/ 
      });
    });
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
