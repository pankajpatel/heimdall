'use strict';

const bcrypt = require('bcrypt');

module.exports = function hashPassword (password, cb) {
  // Generate a salt at level 10 strength
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error(err);
      return cb(err, null);
    } else {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          console.error(err);
        }

        return cb(err, hash);
      });
    }
  });
};
