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
