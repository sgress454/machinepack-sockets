module.exports = {
  friendlyName: 'Leave',
  description: 'Unsubscribes the specified sockets from a room.',
  extendedDescription: 'Unsubscribes the sockets from the room with the specified name.  Any messages subsequently broadcast to the room will no longer be received by those sockets.',
  inputs: {
    roomName: {
      friendlyName: 'Room name',
      example: 'myChatRoom',
      description: 'The name of the room to leave.',
      required: true
    },
    socketIds: {
      friendlyName: 'Socket IDs',
      typeclass: 'array',
      description: 'Unique identifiers of the sockets to subscribe to the room.',
      required: true
    }
  },
  environment: ['sails'],
  defaultExit: 'success',
  exits: { error: { description: 'Unexpected error occurred.' },
    success: { description: 'Done.' } },
  fn: function (inputs,exits,env) {
    env.sails.sockets.leave(
      inputs.socketIds,
      inputs.roomName
    );
    return exits.then();
  },

};
