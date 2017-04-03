'use strict';

const { UserModel } = require('../model/User');

module.exports = function (decoded, request, callback) {
  let session;
  if (request.server.app.useSession) {
    session = request.server.yar.get('session');
    console.log(session);
  }
  if (decoded.user) {
    UserModel.findById(decoded.user._id, (error, user) => {
      if (error) {
        console.error(error);
      }

      if (request.server.app.useSession) {
        if (decoded.session && decoded.session.id && decoded.session.valid === true) {
          return callback(error, true);
        } else {
          return callback(error, false);
        }
      }

      if (!user) {
        return callback(error, false);
      } else {
        return callback(error, true);
      }
    });
  } else {
    return callback({message: 'No User in token'}, false);
  }
};
