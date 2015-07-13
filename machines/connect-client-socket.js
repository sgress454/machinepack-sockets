module.exports = {


  friendlyName: 'Connect client socket',


  description: 'Connect a Socket.io client to a Sails.js server.',


  inputs: {

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

    baseUrl: {
      description: 'The base URL for the Sails.js server',
      example: 'http://localhost:1337',
      required: true
    },

    timeout: {
      description: 'The max time to wait before giving up on initial connection (in miliseconds)',
      example: 5000,
      defaultsTo: 5000
    }

  },


  exits: {

    tookTooLong: {
      description: 'The socket took too long to connect.  Are you sure your internet connection is working?  Or maybe the server is not online, or not accepting WebSocket traffic.',
      extendedDescription: 'It is also possible the server is just slow, in which case you should increase the `timeout` option.'
    },

    success: {
      description: 'Returns a Sails.js/Socket.io client socket.',
      variableName: 'socket',
      example: '==='
    },

  },


  fn: function (inputs,exits) {
    var SocketIOClient = require('socket.io-client');
    var SailsIOClient = require('sails.io.js');

    // Instantiate the socket client (`io`)
    // (we must explicitly pass in the socket.io client when using this library from Node.js)
    var io = SailsIOClient(SocketIOClient);

    // Set some options:
    io.sails.autoConnect = false; // <= prevent a socket from being automatically connected
    io.sails.environment = 'production';    // <= disable log output

    var socket = io.sails.connect(inputs.baseUrl, {
      multiplex: false,          //<= prevent weird entanglement if this happens to get required more than once
      transports: ['websocket']  //<= only use WebSockets (no need for long-polling, etc-- this isn't a browser.)
    });


    // Set up a timeout for the initial socket connection request,
    // as well as a spin-lock (`isDoneAlready`) to prevent accidentally
    // firing `success` more than once if `connect` fires again for some
    // reason (e.g. on reconnect).  This also prevents `success` from firing
    // an extra time if the timeout pops before the initial `connect` event does.
    var isDoneAlready;
    var alarm = setTimeout(function socketConnectionTimedOut(){
      if (isDoneAlready){
        return;
      }
      isDoneAlready = true;
      // TODO: also unbind connection event for performance reasons (i.e. socket.off())
      try {
        socket.disconnect();
      }
      catch (e) {
        return exits.error('Socket took too long, and then there was an additional error disconnecting it:\n'+e.stack);
      }
      return exits.tookTooLong();
    }, inputs.timeout);
    socket.on('connect', function (){
      if (isDoneAlready){
        return;
      }
      isDoneAlready = true;
      clearTimeout(alarm);
      return exits.success(socket);
    });


    // Bind provided socket event handlers.
    inputs.eventListeners.forEach(function (eventBinding){
      socket.on(eventBinding.name, eventBinding.fn);
    });

  }


};
