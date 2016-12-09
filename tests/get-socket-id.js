var assert = require('assert');
var path = require('path');
var SailsApp = require('sails').Sails;
var Sockets = require('../');
var _ = require('@sailshq/lodash');
var lifecycle = require('./helpers/lifecycle');

describe('machinepack-sockets: get-socket-id', function() {

  var app;
  var io;
  var socketId;

  before(function(done) {
    lifecycle.liftSails({
      routes: {
        '/getSocketId': function(req, res) {
          Sockets.getSocketId().setEnvironment({req: req}).exec({
            success: function(socketId) {return res.ok(socketId);},
            error: function() {return res.ok('reqNotCompatible');}
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


  describe('with valid inputs', function() {

    var socket;
    before(function(done) {
      socket = io.sails.connect('http://localhost:1492', {multiplex: false});
      socket.on('connect', done);
    });

    after(function(done) {
      socket.disconnect();
      setTimeout(done, 500);
    });

    it('should return the correct socket ID', function(done) {
      socket.get('/getSocketId', function(socketId) {
        assert.equal(socketId, '/#' + socket._raw.id);
        return done();
      });
    });
  });

  describe('when called from a non-socket request', function() {

    it('should return through the `error` exit', function(done) {
      app.request('/getSocketId', function(err, response, body) {
        assert.equal(body, 'reqNotCompatible');
        return done();
      });
    });
  });
});
