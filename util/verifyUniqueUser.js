'use strict';

const Boom = require('boom');

const { UserModel } = require('../model/User');

module.exports = function verifyUniqueUser (req, reply) {
  UserModel.findOne({
    $or: [
      { email: req.payload.email },
      { username: req.payload.username }
    ]
  }, (err, user) => {
    if (err) {
      console.error(err);
      reply(Boom.badRequest(err));
    } else {
      if (user) {
        if (user.username === req.payload.username) {
          reply(Boom.badRequest('Username taken'));
        } else if (user.email === req.payload.email) {
          reply(Boom.badRequest('Email taken'));
        }
      } else {
        reply(req.payload);
      }
    }
  });
};
