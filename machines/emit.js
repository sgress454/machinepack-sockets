module.exports = {

  friendlyName: 'Emit',


  description: 'Send a message to one or more connected sockets.',


  extendedDescription: '',


  inputs: {
    socketIds: {
      friendlyName: 'Recipients (socket IDs)',
      example: ['a82ghda99319gadgaa3249103'],
      description: 'Unique identifiers for the sockets who will receive this message.',
      required: true
    },
    eventName: {
      friendlyName: 'Message name',
      description: 'The name (aka "event name") to use for the message (just an arbitrary label)',
      example: 'news',
      required: true
    },
    data: {
      typeclass: '*',
      friendlyName: 'Message data',
      description: 'Data to send with the message.',
    }
  },


  environment: ['sails'],


  defaultExit: 'success',


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
    env.sails.sockets.emit(
      inputs.socketIds,
      inputs.eventName || 'message',
      inputs.data || null
    );
    return exits.success();
  },

};
