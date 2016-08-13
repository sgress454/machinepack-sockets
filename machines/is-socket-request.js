module.exports = {


  friendlyName: 'Is socket request?',


  description: 'Determine whether or not the incoming request was made via socket.io.',


  extendedDescription: 'Returns `true` if the request was made via socket.io, and `false` otherwise (e.g. if it was made via a browser or AJAX request).',


  sync: true,


  sideEffects: 'cacheable',


  habitat: 'request',


  inputs: {

  },


  exits: {

    success: {
      outputFriendlyName: 'Is socket request?',
      outputDescription: 'Whether the incoming request was made via socket.io.',
      outputExample: true
    },

  },


  fn: function(inputs, exits, env) {

    // Import the `isObject` Lodash function.
    var _isObject = require('lodash.isobject');

    // If we don't have a request object in our environment, bail through the `error` exit.
    if (!_isObject(env.req) || !_isObject(env.req._sails) || env.req._sails.constructor.name !== 'Sails') {
      return exits.error(new Error('A valid Sails request object must be provided through `.setEnv()` in order to use this machine.'));
    }

    // If the request is a socket request, output `true` through
    // the `reqNotCompatible` exit.
    if (env.req.isSocket){
      return exits.success(true);
    }

    // Otherwise output `false` through the `success` exit.
    return exits.success(false);

  },



};
