'use strict';

const Boom = require('boom');
const JWT = require('jsonwebtoken');
const {
  UserModel,
  CreateUserSchema,
  AuthenticateUserSchema
} = require('../model/User');

const hashPassword = require('../util/hash');
const createToken = require('../util/token');
const createSession = require('../util/session');
const verifyCredentials = require('../util/verifyCredentials');
const verifyUniqueUser = require('../util/verifyUniqueUser');

module.exports = (key) => [
  /*
  {
    method: 'GET',
    path: '/api/users',
    config: {
      handler: (req, res) => {
        UserModel
          .find()
          // Deselect the password and version fields
          .select('-password -__v')
          .exec((err, users) => {
            if (err) {
              throw Boom.badRequest(err);
            }
            if (!users.length) {
              throw Boom.notFound('No users found!');
            }
            res(users);
          })
      }
    }
  },
  */
  { // register
    method: 'POST',
    path: '/auth/register',
    config: {
      auth: false,
      pre: [
        { method: verifyUniqueUser }
      ],
      handler: (request, reply) => {
        let user = new UserModel();
        user.email = request.payload.email;
        user.username = request.payload.username;
        user.verified = false;
        // TODO: add more scopes for user
        user.admin = false;

        hashPassword(request.payload.password, (err, hash) => {
          if (err) {
            console.error(err);
            throw Boom.badRequest(err);
          }
          user.password = hash;
          user.save((err, user) => {
            if (err) {
              console.error(err);
              throw Boom.badRequest(err);
            }
            let data = { user: user };
            let token = {};
            if (request.server.app.useSession) {
              const session = createSession();
              data['session'] = session.id;
              token = createToken(data, key);
              session.token = token;
              request.yar.set('session', session);
            } else {
              token = createToken(data, key);
            }

            reply({status: 1})
              .header('Authorization', token)
              .code(201);
          });
        });
      },
      validate: {
        payload: CreateUserSchema
      }
    }
  }, { // login/auth
    method: 'POST',
    path: '/auth/login',
    config: {
      auth: false,
      pre: [
        { method: verifyCredentials, assign: 'user' }
      ],
      handler: (request, reply) => {
        let data = { user: request.pre.user };
        let token = {};
        if (request.server.app.useSession) {
          const session = createSession();
          data['session'] = session.id;
          token = createToken(data, key);
          session.token = token;
          request.yar.set('session', session);
        } else {
          token = createToken(data, key);
        }

        reply({status: 1, token: token})
          .header('Authorization', token)
          .code(201);
      },
      validate: {
        payload: AuthenticateUserSchema
      }
    }
  }, { // renew
    method: 'GET',
    path: '/auth/renew',
    config: {
      auth: 'jwt',
      handler: function (request, reply) {
        let data = { user: JWT.decode(request.headers['authorization']).user };
        let token = {};
        if (request.server.app.useSession) {
          const session = createSession();
          data['session'] = session.id;
          token = createToken(data, key);
          session.token = token;
          request.yar.set('session', session);
        } else {
          token = createToken(data, key);
        }

        reply({status: 1})
          .header('Authorization', token)
          .code(201);
      }
    }
  }, { // logout
    method: ['GET', 'POST'],
    path: '/auth/logout',
    config: {
      auth: 'jwt',
      handler: function (request, reply) {
        if (request.server.app.useSession) {
          request.yar.clear('session');
        }

        reply({status: 0, message: 'You have been logged out!'});
      }
    }
  }, { // use session
    method: ['GET', 'POST'],
    path: '/auth/use',
    config: {
      auth: 'jwt',
      handler: function (request, reply) {
        request.server.app.useSession = true;

        reply({status: 0});
      }
    }
  }, { // don't use session
    method: ['GET', 'POST'],
    path: '/auth/unuse',
    config: {
      auth: 'jwt',
      handler: function (request, reply) {
        request.server.app.useSession = false;

        reply({status: 0});
      }
    }
  }, { // forgot password
    method: 'GET',
    path: '/auth/forgot',
    config: {
      auth: false,
      handler: function (request, reply) {
        reply({status: 0});
      }
    }
  }, { // start the reset password
    method: 'GET',
    path: '/auth/reset',
    config: {
      auth: 'jwt',
      handler: function (request, reply) {
        reply({status: 0});
      }
    }
  }, { // update password fron the reset password GET
    method: 'POST',
    path: '/auth/reset',
    config: {
      auth: 'jwt',
      handler: function (request, reply) {
        reply({status: 0});
      }
    }
  }, { // email verification
    method: ['GET', 'POST'],
    path: '/auth/verify',
    config: {
      auth: 'jwt',
      handler: function (request, reply) {
        reply({status: 0});
      }
    }
  }
];
