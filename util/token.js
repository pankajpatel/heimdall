'use strict';

const jwt = require('jsonwebtoken');

function createToken (data, secret) {
  return jwt.sign(data, secret, { expiresIn: '24h' });
}

module.exports = createToken;
