module.exports = {
  friendlyName: 'Emit',
  description: 'Send a message to a single socket.',
  extendedDescription: '',
  inputs: {
    socketIds: {
      friendlyName: 'Socket IDs',
      typeclass: 'array',
      description: 'Unique identifiers of the sockets to send a message to.',
      required: true
    },
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
    }
  },
  environment: ['sails'],
  defaultExit: 'then',
  exits: { error: { description: 'Unexpected error occurred.' },
    then: { description: 'Done.', void: true } },
  fn: function (inputs,exits,env) {
    env.sails.sockets.emit(
      inputs.socketIds,
      inputs.eventName,
      inputs.data || null
    );
    return exits.then();
  },

};
