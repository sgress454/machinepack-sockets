var assert = require('assert');
var path = require('path');
var SailsApp = require('sails').Sails;
var Sockets = require('../');
var _ = require('lodash');
var lifecycle = require('./helpers/lifecycle');

describe('machinepack-sockets: blast', function() {

  var app;
  var io;
  before(function(done) {
    lifecycle.liftSails(function(err, _sails, _io) {
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

    var socket1, socket2;

    before(function(done) {
      socket1 = io.sails.connect();
      socket2 = io.sails.connect();
      var connectedSockets = [];
      _.each([socket1, socket2], function(socket) {
        socket.on('connect', function() {
          connectedSockets.push(socket);
          if (connectedSockets.length === 2) {return done();}
        });
      });
    });

    after(function(done) {
      socket1.disconnect();
      socket2.disconnect();
      setTimeout(done, 500);
    });

    it('should blast a message to all connected sockets', function(done) {

      var receivedMsg = [];
      _.each([socket1, socket2], function(socket) {
        socket.on('foo', function(data) {
          assert.equal(data, 'bar!');
          receivedMsg.push(socket);
          if (receivedMsg.length === 2) {return done();}
        });
      });

      Sockets.blast({
        eventName: 'foo',
        data: 'bar!'
      }).setEnvironment({sails: app}).execSync();

    });

  });

});
