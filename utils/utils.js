const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');

function generateToken() {
  return uuidv4();
}

function hashPasswordWithSha1(password) {
  return sha1(password);
}

module.exports = {
  generateToken,
  hashPasswordWithSha1,
};
