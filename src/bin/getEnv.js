/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
const fs = require('fs');
const { Cypher } = require('./cypherEnv');

function getDataJson() {
  const envJson = require('../env.json');
  const env = process.env.ENV || 'development';
  return envJson[env];
}

async function get() {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync('./src/env.json')) {
        const cypherClass = new Cypher('./src/env.crypt', process.env.DECRYPT, 'json');
        cypherClass.decrypt().then(() => {
          setTimeout(() => {
            resolve(getDataJson());
          }, 200);
        });
      } else {
        resolve(getDataJson());
      }
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { get };
