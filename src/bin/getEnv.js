const envJson = require('../env.json');

function get() {
  const env = process.env.ENV || 'development';
  return envJson[env];
}

module.exports = {
  get,
};
