/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
const fs = require('fs');

function get() {
  if (!fs.existsSync('./src/env.json')) return { notFound: true };
  const envJson = require('../env.json');
  const env = process.env.ENV || 'development';
  return envJson[env];
}

module.exports = { get };
