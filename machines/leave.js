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
