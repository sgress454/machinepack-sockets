module.exports = {


  friendlyName: 'Join room',


  description: 'Subscribes the specified sockets to a room.',


  extendedDescription: 'Subscribes the sockets to the room with the specified name.  Any messages subsequently broadcast to the room will be received by those sockets.',


  sideEffects: 'idempotent',


  habitat: 'sails',


  sync: true,


  inputs: {

    roomName: {
      example: 'myChatRoom',
      description: 'The name of the room to join.',
      required: true
    },

    socketIds: {
      friendlyName: 'Socket IDs',
      example: ['a82ghda99319gadgaa3249103'],
      description: 'Unique identifiers of the sockets to subscribe to the room.',
      required: true
    }

  },


  fn: function(inputs, exits, env) {

    // Import the `isObject` Lodash function.
    var _isObject = require('lodash.isobject');

    // If we don't have a Sails app in our environment, bail through the `error` exit.
    if (!_isObject(env.sails) || env.sails.constructor.name !== 'Sails') {
      return exits.error(new Error('A valid Sails app must be provided through `.setEnv()` in order to use this machine.'));
    }

    // If we don't have the sockets hook enabled in our environment, bail through the `error` exit.
    if (!_isObject(env.sails.sockets)) {
      return exits.error(new Error('The `sockets` hook must be enabled on the passed-in Sails app in order to use this machine.'));
    }

    // Use `sails.sockets.join` to subscribe the sockets with the
    // specified IDs to `inputs.roomName`.
    env.sails.sockets.join(
      inputs.socketIds,
      inputs.roomName
    );

    // Return through the `success` exit.
    return exits.success();
  },

};
