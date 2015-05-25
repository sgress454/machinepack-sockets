module.exports = {


  friendlyName: 'Send to room',


  description: 'Broadcast a message to all connected sockets in the specified room.',


  extendedDescription: 'Note that this machine does not wait for any kind of acknowledgement of message delivery, so it is immediate/synchronous.',


  inputs: {
    eventName: {
      friendlyName: 'Message name',
      description: 'The name (aka "event name") to use for the message (just an arbitrary label)',
      example: 'news',
      required: true
    },
    data: {
      example: '*',
      friendlyName: 'Message data',
      description: 'Data to send with the message.',
    },
    // omitRequestor: {
    //   friendlyName: 'Skip requesting socket?',
    //   example: true,
    //   description: 'Do not send the message to the requesting socket.',
    //   friendlyName: 'Omit requesting socket'
    // },
    roomName: {
      friendlyName: 'Room',
      example: 'myChatRoom',
      description: 'The name of the room where this message will be broadcasted.',
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
    env.sails.sockets.broadcast(
      inputs.roomName,
      inputs.eventName || 'message',
      inputs.data || null
    );
    return exits.success();
  },

};
