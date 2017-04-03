'use strict';

const aguid = require('aguid');

module.exports = function createSession () {
  return {
    valid: true, // this will be set to false when the person logs out
    id: aguid(), // a random session id
    start: new Date(),
    exp: new Date().getTime() + 24 * 60 * 60 * 1000 // expires in 24 hours time
  };
};
