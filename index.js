const pkg = require('./package');
const routes = require('./routes/user.js');

let Auth = {};

Auth.register = function (server, options, next) {
  server.register(require('hapi-auth-jwt2'), function (err) {
    if (err) {
      throw err;
    }

    server.auth.strategy('jwt', 'jwt', true, {
      key: options.key,
      validateFunc: require('./util/validator'),
      verifyOptions: { algorithms: [ 'HS256' ], ignoreExpiration: true }
    });

    server.route(routes(options.key));
  });
  next();
};

Auth.register.attributes = {
  name: pkg.name,
  version: pkg.version
};

module.exports = Auth;
