module.exports = {


  friendlyName: 'Leave room',


  description: 'Unsubscribes the specified sockets from a room.',


  extendedDescription: 'Unsubscribes the sockets from the room with the specified name.  Any messages subsequently broadcast to the room will no longer be received by those sockets.',


  idempotent: true,


  inputs: {
    roomName: {
      friendlyName: 'Room name',
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
    env.sails.sockets.leave(
      inputs.socketIds,
      inputs.roomName
    );
    return exits.success();
  },

};
