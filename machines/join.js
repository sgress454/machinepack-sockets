module.exports = {
  friendlyName: 'Join',
  description: 'Subscribes the specified sockets to a room.',
  extendedDescription: 'Subscribes the sockets to the room with the specified name.  Any messages subsequently broadcast to the room will be received by those sockets.',
  inputs: {
    roomName: {
      friendlyName: 'Room name',
      example: 'myChatRoom',
      description: 'The name of the room to join.',
      required: true
    },
    socketIds: {
      friendlyName: 'Socket IDs',
      typeclass: 'array',
      description: 'Unique identifiers of the sockets to subscribe to the room.'
    }
  },
  environment: ['req', 'sails'],
  defaultExit: 'then',
  exits: { error: { description: 'Unexpected error occurred.' },
    then: { description: 'Done.', void: true } },
  fn: function (inputs,exits,env) {
    env.sails.sockets.join(
      inputs.socketIds,
      inputs.roomName
    );
    return exits.then();
  },

};
