var assert = require('assert');
var path = require('path');
var SailsApp = require('sails').Sails;
var _ = require('@sailshq/lodash');
var Sockets = require('../');
var lifecycle = require('./helpers/lifecycle');

describe('machinepack-sockets: connect-client-socket', function() {

  var app;
  var io;
  before(function(done) {
    lifecycle.liftSails({
      // log: { level: 'silly' },
      routes: {
        '/owl': function(req, res) {
          return res.send('hoot');
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



  describe('when connecting to a server with a bad port, i.e. such that it doesnt actually exist', function (){

    it('should call `tookTooLong` if the connection times out', function(done) {

      Sockets.connectClientSocket({
        baseUrl: 'http://localhost:1499',
        timeout: 100
      }).exec({
        error: function (err) {
          return done(err);
        },
        tookTooLong: function() {
          return done();
        },
        success: function() {
          return done(new Error('Called `success` exit!'));
        },
      });

    });

  });

  // describe('with valid inputs', function() {

  //   var socket;
  //   var receivedEvent = false;
  //   before(function(done) {
  //     Sockets.connectClientSocket({
  //       eventListeners: [
  //         {
  //           name: 'boom',
  //           fn : function(data) {
  //             try {
  //               assert.equal(data, 'shakalaka');
  //               receivedEvent = true;
  //             } catch (e) {
  //               console.error('In "boom" handler: ran into error:'+e.stack);
  //             }//</catch>
  //           }
  //         }
  //       ],
  //       baseUrl: 'http://localhost:1492'
  //     }).exec({
  //       success: function(_socket) {
  //         socket = _socket;
  //         return done();
  //       },
  //       error: done,
  //       tookTooLong: function() {
  //         return done(new Error('Called `tookTooLong` exit!'));
  //       }
  //     });
  //   });

  //   after(function(done) {
  //     socket.disconnect();
  //     setTimeout(done, 500);
  //   });

  //   it('a socket should connect successfully', function() {
  //     assert(socket._raw.connected);
  //   });

  //   it('should be able to send Sails requests', function(done) {
  //     socket.get('/owl', function(responseBody, jwr) {
  //       if (jwr.error) { return done(jwr.error); }

  //       try {
  //         assert.equal(responseBody, 'hoot');
  //       } catch (e) { return done(e); }

  //       return done();
  //     });
  //   });

  //   it('should be able to receive socket events', function(done) {
  //     app.sockets.blast('boom', 'shakalaka');

  //     setTimeout(function() {

  //       try {
  //         assert(receivedEvent);
  //       } catch (e) { return done(e); }

  //       return done();

  //     }, 500);//</setTimeout>

  //   });//</it>

  // });



});
