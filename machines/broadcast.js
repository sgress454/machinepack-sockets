module.exports = {
  friendlyName: 'Broadcast',
  description: 'Broadcast a message to all sockets in a room.',
  extendedDescription: '',
  inputs: {
    eventName: {
      example: 'news',
      friendlyName: 'Event name',
      description: 'The event name to use for the message.',
      required: true
    },
    data: {
      typeclass: '*',
      friendlyName: 'Data',
      description: 'Data to send with the message.',
    },
    omitRequestor: {
      friendlyName: 'Skip requesting socket?',
      example: true,
      description: 'Do not send the message to the requesting socket.',
      friendlyName: 'Omit requesting socket'
    },
    roomName: {
      friendlyName: 'Room name',
      example: 'myChatRoom',
      description: 'The name of the room to broadcast to.',
      required: true
    }
  },
  environment: ['req', 'sails'],
  defaultExit: 'then',
  exits: { error: { description: 'Unexpected error occurred.' },
    then: { description: 'Done.', void: true } },
  fn: function (inputs,exits,env) {
    env.sails.sockets.broadcast(
      inputs.roomName,
      inputs.eventName,
      inputs.data || null,
      inputs.omitRequestor && env.req.socket
    );
    return exits.then();
  },

};
