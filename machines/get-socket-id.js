module.exports = {
  friendlyName: 'Get requesting socket ID',
  description: 'Get the unique ID of the socket making this virtual HTTP request.',
  extendedDescription: '',
  sync: true,
  cacheable: true,
  inputs: {},
  defaultExit: 'success',
  environment: ['req', 'sails'],
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    success: {
      friendlyName: 'then',
      description: 'Done.',
      example: 'abc123'
    },
    reqNotCompatible: {
      description: 'This request did not originate from Socket.io.'
    }
  },
  fn: function(inputs, exits, env) {
    if (!env.req.isSocket){
      return exits.reqNotCompatible();
    }
    return exits.success(env.sails.sockets.id(env.req.socket));
  },

};
