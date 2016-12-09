module.exports = {


  friendlyName: 'Connect client socket',


  description: 'Connect a Socket.io client to a Sails.js server.',


  inputs: {

    baseUrl: {
      description: 'The base URL for the Sails.js server.',
      example: 'http://localhost:1337',
      required: true
    },

    eventListeners: {
      description: 'A mapping of event listeners for client socket events.',
      example: [
        {
          name: 'foobar',
          fn: '->'
        }
      ],
      defaultsTo: []
    },

    timeout: {
      description: 'The max time to wait before giving up on initial connection (in miliseconds).',
      example: 5000,
      defaultsTo: 5000
    }

  },


  exits: {

    success: {
      outputDescription: 'A Sails.js/Socket.io client socket.',
      outputFriendlyName: 'Socket',
      outputExample: '==='
    },

    tookTooLong: {
      description: 'The socket took too long to connect.',
      extendedDescription: 'Are you sure your internet connection is working?  Or maybe the server is not online, or not accepting WebSocket traffic.  It is also possible the server is just slow, in which case you should increase the `timeout` option.'
    },

  },


  fn: function (inputs,exits) {

    // Import `machinepack-util` so that we can use its cache-busting require.
    var Util = require('machinepack-util');

    // Import `sails.io.js`.
    var SailsIOClient = require('sails.io.js');

    // Import `socket.io-client`....
    // but invalidate the existing `socket.io-client` in the require cache
    // (the one that was already required from this package - if there is one)
    //
    // > We do this because `socket.io-client` is inherently stateful,
    // > and sails.io.js modifies it.  This way, we always get a fresh
    // > Socket.io client.
    var SocketIOClient = Util.require({
      path: require.resolve('socket.io-client'),
      clearCache: true
    }).execSync();

    // Instantiate the socket client (`io`).
    // We must explicitly pass in the socket.io client when
    // using this library from Node.js.
    var io = SailsIOClient(SocketIOClient);

    // Prevent the socket from being automatically connected.
    io.sails.autoConnect = false;

    // Disable log output for the socket.
    io.sails.environment = 'production';

    // Declare a var to hold the socket we'll attempt to connect.
    var socket;

    // Set up a timeout for the initial socket connection request,
    // as well as a spin-lock (`isDoneAlready`) to prevent accidentally
    // firing `success` more than once if `connect` fires again for some
    // reason (e.g. on reconnect).  This also prevents `success` from firing
    // an extra time if the timeout pops before the initial `connect` event does.
    var isDoneAlready;
    var alarm = setTimeout(function socketConnectionTimedOut(){
      // If the timeout happens after the spinlock is set,
      // do nothing (we already connected).
      if (isDoneAlready){
        return;
      }
      // Set the spinlock.
      isDoneAlready = true;

      // Attempt to check if the socket is connected, and if so,
      // gracefully disconnect it.
      //
      // > FUTURE: also potentially unbind connection event for performance reasons
      // > (i.e. socket.off())
      try {
        if (socket.isConnected()) {
          socket.disconnect();
        }
      }
      // Forward errors disconnecting the socket to the `error` exit.
      catch (e) {
        return exits.error(new Error('Socket took too long, and then there was an additional error disconnecting it.  Here it is:\n```\n'+e.stack+'\n```'));
      }
      // Leave through the `tookTooLong` exit.
      return exits.tookTooLong();
    }, inputs.timeout);

    // Attempt to connect the socket.
    socket = io.sails.connect(inputs.baseUrl, {
      // Ensure that each connected socket is unique.
      multiplex: false,
      // Only use WebSockets.
      // No need for long-polling, etc-- this isn't a browser.
      transports: ['websocket']
    });

    // Set up a handler for the initial socket connection.
    socket.on('connect', function (){
      // If the spinlock is set, do nothing (we already timed out).
      if (isDoneAlready){
        return;
      }
      // Set the spinlock.
      isDoneAlready = true;
      // Clear the timeout.
      clearTimeout(alarm);
      // Return the connected socket through the `success` exit.
      return exits.success(socket);
    });

    // Bind provided socket event handlers.
    inputs.eventListeners.forEach(function (eventBinding){
      socket.on(eventBinding.name, eventBinding.fn);
    });

  }


};
