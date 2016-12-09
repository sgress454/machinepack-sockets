var assert = require('assert');
var path = require('path');
var SailsApp = require('sails').Sails;
var Sockets = require('../');
var _ = require('@sailshq/lodash');
var lifecycle = require('./helpers/lifecycle');

describe('machinepack-sockets: is-socket-request', function() {

  var app;
  var io;
  var socketId;

  before(function(done) {
    lifecycle.liftSails({
      routes: {
        '/isSocketRequest': function(req, res) {
          Sockets.isSocketRequest().setEnv({req: req}).exec({
            success: function(isSocket) {
              if (isSocket) {return res.ok(true);}
              // Because the virtual request interpreter doesn't dig `false` as a body.
              return res.ok('not a socket request!');
            },
            error: function(e) {console.log(e);return res.serverError();}
          });
        }
      }
    }, function(err, _sails, _io) {
      if (err) {return done(err);}
      app = _sails;
      io = _io;
      return done();
    });
  });

  after(function(done) {
    lifecycle.lowerSails(app, done);
  });


  describe('when called using socket.io', function() {

    var socket;
    before(function(done) {
      socket = io.sails.connect('http://localhost:1492', {multiplex: false});
      socket.on('connect', done);
    });

    after(function(done) {
      socket.disconnect();
      setTimeout(done, 500);
    });

    it('should return `true` through the success exit', function(done) {
      socket.get('/isSocketRequest', function(isSocket) {
        assert.equal(isSocket, true);
        return done();
      });
    });
  });

  describe('when called from a non-socket request', function() {

    it('should return `false` through the success exit', function(done) {
      app.request('/isSocketRequest', function(err, response, body) {
        assert.equal(body, 'not a socket request!');
        return done();
      });
    });
  });
});
