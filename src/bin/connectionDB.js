const mongoose = require('mongoose');

const url = `mongodb://${
  process.env.DB_USER === true ? `${process.env.DB_USER}:${process.env.DB_PASSWORD}@` : ''
}${process.env.DB_DOMAIN}:${process.env.DB_PORT}/chat`;

const opts = {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

console.log(url);
mongoose.connect(url, opts, (err) => {
  if (err) {
    return console.log('The conection failed');
  }
  console.log(`Conection success with dbMongo on port ${process.env.DB_PORT}`);
});

module.exports = mongoose;
