module.exports = {
  friendlyName: 'Get Socket ID',
  description: 'Get the unique ID of the requesting socket.',
  extendedDescription: '',
  inputs: {},
  defaultExit: 'then',
  environment: ['req', 'sails'],
  exits: { error: { description: 'Unexpected error occurred.' },
    then: { description: 'Done.', example: 'abc123' } },
  fn: function (inputs,exits,env) {
    return exits.then(env.sails.sockets.id(env.req.socket));
  },

};
