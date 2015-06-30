module.exports = {
  friendlyName: 'Join room',
  description: 'Subscribes the specified sockets to a room.',
  extendedDescription: 'Subscribes the sockets to the room with the specified name.  Any messages subsequently broadcast to the room will be received by those sockets.',
  idempotent: true,
  inputs: {
    roomName: {
      friendlyName: 'Room name',
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
  environment: ['sails'],
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    success: {
      friendlyName: 'then',
      description: 'Done.'
    }
  },
  fn: function(inputs, exits, env) {
    env.sails.sockets.join(
      inputs.socketIds,
      inputs.roomName
    );
    return exits.success();
  },

};
