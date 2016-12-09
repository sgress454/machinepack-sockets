module.exports = {


  friendlyName: 'Get requesting socket ID',


  description: 'Get the unique ID of the client socket making this virtual HTTP request.',


  sync: true,


  sideEffects: 'cacheable',


  habitat: 'request',


  inputs: {},


  exits: {

    success: {
      outputFriendlyName: 'Socket ID',
      outputDescription: 'The ID of the requesting socket.',
      outputExample: 'abc123'
    },

    reqNotCompatible: {
      friendlyName: 'Request not compatible',
      description: 'This request did not originate from Socket.io.'
    }
  },


  fn: function(inputs, exits, env) {

    // Import Lodash.
    var _ = require('@sailshq/lodash');

    // If we don't have a request object in our environment, bail through the `error` exit.
    if (!_.isObject(env.req) || !_.isObject(env.req._sails) || env.req._sails.constructor.name !== 'Sails') {
      return exits.error(new Error('A valid Sails request object must be provided through `.setEnv()` in order to use this machine.'));
    }

    // If we don't have the sockets hook enabled in our environment, bail through the `error` exit.
    if (!_.isObject(env.req._sails.sockets)) {
      return exits.error(new Error('The `sockets` hook must be enabled on the Sails app that handles the request in order to use this machine.'));
    }

    // If the request is not a socket request, leave through
    // the `reqNotCompatible` exit.
    if (!env.req.isSocket){
      return exits.reqNotCompatible(new Error('The request was not made via socket.io.'));
    }

    // Otherwise return the requesting socket's ID through
    // the `success` exit.
    return exits.success(env.req._sails.sockets.getId(env.req.socket));
  },

};
