module.exports = {


  friendlyName: 'Broadcast',


  description: 'Broadcast a message to all connected sockets in the specified room.',


  extendedDescription: 'Note that this machine does not wait for any kind of acknowledgement of message delivery, so it is immediate/synchronous.',


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
    },

    // omitRequestor: {
    //   friendlyName: 'Skip requesting socket?',
    //   example: true,
    //   description: 'Do not send the message to the requesting socket.',
    //   friendlyName: 'Omit requesting socket'
    // },
    //
    roomName: {
      friendlyName: 'Room',
      example: 'myChatRoom',
      description: 'The name of the room where this message will be broadcasted.',
      required: true
    }

  },

  fn: function(inputs, exits, env) {

    // Import Lodash.
    var _ = require('@sailshq/lodash');

    // If we don't have a Sails app in our environment, bail through the `error` exit.
    if (!_.isObject(env.sails) || env.sails.constructor.name !== 'Sails') {
      return exits.error(new Error('A valid Sails app must be provided through `.setEnv()` in order to use this machine.'));
    }

    // If we don't have the sockets hook enabled in our environment, bail through the `error` exit.
    if (!_.isObject(env.sails.sockets)) {
      return exits.error(new Error('The `sockets` hook must be enabled on the passed-in Sails app in order to use this machine.'));
    }

    // Use `sails.sockets.blast` to send the message to
    // all sockets subscribed to `inputs.roomName`!
    env.sails.sockets.broadcast(
      inputs.roomName,
      inputs.eventName || 'message',
      inputs.data || null
    );

    // Return through the `success` exit.
    return exits.success();

  },

};
