module.exports = {


  friendlyName: 'Get requesting socket ID',


  description: 'Get the unique ID of the client socket making this virtual HTTP request.',


  sync: true,


  sideEffects: 'cacheable',


  habitat: 'sails',


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

    // If the request is not a socket request, leave through
    // the `reqNotCompatible` exit.
    if (!env.req.isSocket){
      return exits.error(new Error('The request was not made via socket.io.'));
    }

    // Otherwise return the requesting socket's ID through
    // the `success` exit.
    return exits.success(env.req._sails.sockets.id(env.req.socket));
  },

};
