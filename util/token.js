'use strict';

const jwt = require('jsonwebtoken');
require('dotenv').load();
const secret = process.env.JWT_SECRET;

function createToken (data) {
  return jwt.sign(data, secret, { expiresIn: '24h' });
}

module.exports = createToken;
