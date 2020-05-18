/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const env = require('./getEnv').get();

const url = `mongodb://${env.dbUsername ? `${env.dbUsername}:${env.dbPassword}@` : ''}${
  env.dbDomain
}:${env.dbPort}/chat`;

mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      return console.log('The conection failed');
    }
    // eslint-disable-next-line no-console
    console.log(`Conection success with dbMongo on port ${env.dbPort}`);
  }
);

module.exports = mongoose;
