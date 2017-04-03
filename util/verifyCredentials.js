const bcrypt = require('bcrypt');
const Boom = require('boom');

const { UserModel } = require('../model/User');

module.exports = function verifyCredentials (request, reply) {
  const password = request.payload.password;

  UserModel.findOne({
    $or: [
      { email: request.payload.email },
      { username: request.payload.username }
    ]
  }, (err, user) => {
    if (err) {
      reply(Boom.badRequest('Implementation Error'));
    } else if (user) {
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (err) {
          reply(Boom.badRequest('Implementation Error'));
        } else if (isValid) {
          reply({
            _id: user._id,
            username: user.username
          });
        } else {
          reply(Boom.badRequest('Incorrect password!'));
        }
      });
    } else {
      reply(Boom.badRequest('Incorrect username or email!'));
    }
  });
};
