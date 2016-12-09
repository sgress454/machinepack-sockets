var assert = require('assert');
var path = require('path');
var _ = require('@sailshq/lodash');
var SailsApp = require('sails').Sails;
var Sockets = require('../');
var lifecycle = require('./helpers/lifecycle');

describe('machinepack-sockets: leave', function() {

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
      socket1 = io.sails.connect('http://localhost:1492', {multiplex: false});
      socket2 = io.sails.connect('http://localhost:1492', {multiplex: false});
      socket3 = io.sails.connect('http://localhost:1492', {multiplex: false});
      var connectedSockets = [];
      _.each([socket1, socket2, socket3], function(socket) {
        socket.on('connect', function() {
          connectedSockets.push(socket);
          if (connectedSockets.length === 3) {
            return done();
          }
        });
      });
    });

    after(function(done) {
      socket1.disconnect();
      socket2.disconnect();
      socket3.disconnect();
      setTimeout(done, 500);
    });

    it('should unsubscribe the specified sockets from the given room, so that they do not receive messages for that room', function(done) {

      var receivedMsg = [];
      _.each([socket1, socket2, socket3], function(socket, index) {
        socket.on('ifyoulikeit', function(data) {
          if (socket !== socket1){
            return done(new Error('Socket #' + index + ' should not have gotten the message!'));
          }
          assert.equal(data, 'putaringonit!');
          receivedMsg.push(socket);
        });
      });

      app.sockets.join(['/#'+socket1._raw.id, '/#'+socket2._raw.id, '/#'+socket3._raw.id], 'beyonce');
      Sockets.leave({
        roomName: 'beyonce',
        socketIds: ['/#'+socket2._raw.id, '/#'+socket3._raw.id]
      }).setEnvironment({sails: app}).execSync();

      Sockets.broadcast({
        roomName: 'beyonce',
        eventName: 'ifyoulikeit',
        data: 'putaringonit!'
      }).setEnvironment({sails: app}).execSync();

      // Wait 500ms and see who bites
      setTimeout(function() {
        assert.equal(receivedMsg.length, 1);
        assert.equal(receivedMsg[0], socket1);
        return done();
      }, 500);

    });

  });

});
