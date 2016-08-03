var path = require('path');
var SailsApp = require('sails').Sails;
var _ = require('lodash');
var socketioClient = require('socket.io-client');
var sailsioClient = require('sails.io.js');

module.exports = {
  liftSails: function(opts, cb) {

    var Sails = new SailsApp();
    var app;

    if (typeof opts === 'function') {
      cb = opts;
      opts = {};
    }

    opts = _.extend({
      hooks: {grunt: false, views: false},
      log: {level: 'error'},
      globals: false,
      port: 1492
    }, opts);
    Sails.lift(opts, function(err, _sails) {
      if (err) {return cb(err);}

      // Instantiate socket client.
      var client = sailsioClient(socketioClient);

      // Globalize sails.io client as `io`
      var io = client;

      // Set some options.
      io.sails.url = 'http://localhost:1492';
      io.sails.environment = 'production'; //(to disable logging)
      io.sails.autoConnect = 'false';
      io.sails.reconnection = false;
      io.sails.multiplex = false; // (to allow for clean testing of multiple connected sockets)

      return cb(null, _sails, io);

    });


  },

  lowerSails: function(sails, cb) {
    sails.lower(function(err) {
      if (err) {return cb(err);}
      setTimeout(cb, 500);
    });
  }
};
