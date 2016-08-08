module.exports = {


  friendlyName: 'Leave room',


  description: 'Unsubscribes the specified sockets from a room.',


  extendedDescription: 'Unsubscribes the sockets from the room with the specified name.  Any messages subsequently broadcast to the room will no longer be received by those sockets.',


  sideEffects: 'idempotent',


  habitat: 'sails',


  sync: true,


  inputs: {
    roomName: {
      example: 'myChatRoom',
      description: 'The name of the room to leave.',
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

    // Import the `isObject Lodash function.
    var _isObject = require('lodash.isobject');

    // If we don't have a Sails app in our environment, bail through the `error` exit.
    if (!_isObject(env.sails) || env.sails.constructor.name !== 'Sails') {
      return exits.error(new Error('A valid Sails app must be provided through `.setEnv()` in order to use this machine.'));
    }

    // If we don't have the sockets hook enabled in our environment, bail through the `error` exit.
    if (!_isObject(env.sails.sockets)) {
      return exits.error(new Error('The `sockets` hook must be enabled on the passed-in Sails app in order to use this machine.'));
    }

    // Use `sails.sockets.leave` to unsubscribe the sockets with the
    // specified IDs from `inputs.roomName`.
    env.sails.sockets.leave(
      inputs.socketIds,
      inputs.roomName
    );

    // Return through the `success` exit.
    return exits.success();
  },

};
