var assert = require('assert');
var path = require('path');
var SailsApp = require('sails').Sails;
var Sockets = require('../');
var _ = require('@sailshq/lodash');
var lifecycle = require('./helpers/lifecycle');

describe('machinepack-sockets: broadcast', function() {

  var app;
  var io;
  before(function(done) {
    lifecycle.liftSails({
      routes: {
        '/join': function(req, res) {
          app.sockets.join(req, 'hollapeeps');
          return res.ok();
        }
      }
    },function(err, _sails, _io) {
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
      socket1 = io.sails.connect('http://localhost:1492', {multiplex: false});
      socket2 = io.sails.connect('http://localhost:1492', {multiplex: false});
      var connectedSockets = [];
      _.each([socket1, socket2], function(socket) {
        socket.on('connect', function() {
          connectedSockets.push(socket);
          if (connectedSockets.length === 2) {
            // Subscribe socket 1 to the `hollapeeps` room
            socket1.get('/join', function (data, jwr) {
              if (jwr.error) { return done(jwr.error); }
              if (jwr.statusCode !== 200) { return done(new Error('Expected 200 status code but instead got: '+jwr.statusCode)); }
              return done();
            });
          }
        });
      });
    });

    after(function(done) {
      socket1.disconnect();
      socket2.disconnect();
      setTimeout(done, 500);
    });

    it('should broadcast a message to all subscribed sockets, and no unsubscribed sockets', function(done) {

      var receivedMsg = [];
      _.each([socket1, socket2], function(socket) {
        socket.on('holla', function(data) {
          assert.equal(socket, socket1, 'Socket #2 should not have gotten the message!');
          assert.equal(data, 'yoyoyo!');
          receivedMsg.push(socket);
        });
      });

      Sockets.broadcast({
        roomName: 'hollapeeps',
        eventName: 'holla',
        data: 'yoyoyo!'
      }).setEnv({sails: app}).execSync();

      // Wait 500ms and see who bites
      setTimeout(function() {
        assert.equal(receivedMsg.length, 1);
        assert.equal(receivedMsg[0], socket1);
        return done();
      }, 500);

    });

  });

});
