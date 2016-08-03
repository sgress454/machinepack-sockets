module.exports = {


  friendlyName: 'Blast',


  description: 'Blast out a message to all connected sockets.',


  extendedDescription: 'This will send a message to EVERY socket connected to an app, as opposed to "Broadcast" which only sends messages to a specific room.  Note that this machine does not wait for any kind of acknowledgement of message delivery, so it is immediate/synchronous.',


  habitat: 'sails',


  sync: true,


  inputs: {
    eventName: {
      friendlyName: 'Message name',
      description: 'The name (aka "event name") to use for the message (just an arbitrary label).',
      example: 'news',
      required: true
    },
    data: {
      example: '*',
      friendlyName: 'Message data',
      description: 'Data to send with the message.',
    }
  },


  fn: function(inputs, exits, env) {

    // Use `sails.sockets.blast` to send the message to
    // all connected sockets!
    env.sails.sockets.blast(
      inputs.eventName || 'message',
      inputs.data || null
    );

    // Return through the `success` exit.
    return exits.success();
  }


};
