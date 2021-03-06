var path = require('path');
var _ = require('@sailshq/lodash');
var SailsApp = require('sails').Sails;
var SHSockets = require('sails-hook-sockets');
var sailsioClient = require('sails.io.js');

module.exports = {
  liftSails: function(opts, cb) {

    var sails = new SailsApp();
    var app;

    if (typeof opts === 'function') {
      cb = opts;
      opts = {};
    }

    opts = _.extend({
      hooks: {
        grunt: false,
        views: false,
        sockets: SHSockets
      },
      log: {
        level: 'warn'
      },
      globals: false,
      port: 1492
    }, opts);


    sails.lift(opts, function(err) {
      if (err) { return cb(err); }

      // Invalidate socket.io-client in require cache
      _.each(_.keys(require.cache), function (modulePath) {
        if (modulePath.match(/socket.io-client/)){
          delete require.cache[modulePath];
        }
      });

      // Require socket.io-client fresh
      var socketioClient = require('socket.io-client');

      // Instantiate socket client.
      var client = sailsioClient(socketioClient);

      // Globalize sails.io client as `io`
      var io = client;

      // Set some options.
      io.sails.url = 'http://localhost:1492';
      io.sails.environment = 'production'; //(to disable logging)
      io.sails.autoConnect = false;
      io.sails.reconnection = false;
      io.sails.multiplex = false; // (to allow for clean testing of multiple connected sockets)

      return cb(undefined, sails, io);

    });


  },

  lowerSails: function(sails, cb) {

    sails.lower(function(err) {
      if (err) { return cb(err); }
      return cb();
    });

  }

};
