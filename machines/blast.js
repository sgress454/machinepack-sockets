module.exports = {
  friendlyName: 'Blast',
  description: 'Broadcast a message to all connected sockets.',
  extendedDescription: 'This will send a message to EVERY socket connected to an app, as opposed to "Broadcast" which only sends messages to a specific room.',
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
    }
  },
  environment: ['req', 'sails'],
  defaultExit: 'then',
  exits: { error: { description: 'Unexpected error occurred.' },
    then: { description: 'Done.', void: true } },
  fn: function (inputs,exits,env) {
    env.sails.sockets.blast(
      inputs.eventName,
      inputs.data || null,
      inputs.omitRequestor && env.req.socket
    );
    return exits.then();
  },

};
