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
    if (!env.req.isSocket){
      return exits.reqNotCompatible();
    }
    return exits.success(env.req._sails.sockets.id(env.req.socket));
  },

};
