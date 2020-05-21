const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
// eslint-disable-next-line prefer-destructuring
const opts = {
  path: { alias: 'fr', describe: 'path`s file', require: true },
  password: { alias: 'pswd', require: true, describe: 'password for encrypt/decrypt' },
  destination: { alias: 'to', require: false, describe: 'path where the file will save' },
  extDestination: {
    alias: 'ext',
    default: 'crypt',
    describe: 'path where the file will save',
  },
  salt: { alias: 'salt', default: 24 },
  algorith: { alias: 'alg', describe: 'path`s file', default: 'aes-192-cbc' },
};

const yargs = require('yargs')
  .command('encrypt', 'encrypt a file', opts)
  .command('decrypt', 'decrypt a file', opts)
  .help().argv;

class Cypher {
  constructor(
    pathOrigin,
    password,
    extensionDestino = 'crypt',
    destination = null,
    salt = null,
    algorithm = null
  ) {
    this.path = path.resolve(`${pathOrigin}`);
    this.password = password;

    this.ext = extensionDestino || 'crypto';
    this.destination = destination;
    this.salt = salt || 24;
    this.algorithm = algorithm || 'aes-192-cbc';

    this.iv = Buffer.alloc(16, 0);
    this.key = crypto.scryptSync(this.password, 'salt', this.salt);
  }

  async encrypt() {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    const input = fs.createReadStream(this.path);
    const fileName = path.basename(this.path);

    const out =
      this.destination ||
      `${path.dirname(this.path)}/${fileName.split('.')[0]}.${this.ext}`;

    const output = await fs.createWriteStream(out);
    await input.pipe(cipher).pipe(output);
  }

  async decrypt() {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    const input = fs.createReadStream(`${this.path}`);
    const fileName = path.basename(this.path);

    const out =
      this.destination ||
      `${path.dirname(this.path)}/${fileName.split('.')[0]}.${this.ext}`;

    const output = await fs.createWriteStream(out);
    await input.pipe(decipher).pipe(output);
  }
}

module.exports = { Cypher };

if (yargs._[0] === 'encrypt') {
  const cypher = new Cypher(yargs.fr, yargs.pswd, yargs.ext, yargs.to);
  cypher.encrypt();
} else if (yargs._[0] === 'decrypt') {
  const cypher = new Cypher(yargs.fr, yargs.pswd, yargs.ext, yargs.to);
  cypher.decrypt();
}

// node ./src/bin/cypherEnv.js encrypt --fr ./src/bin/message.js --pswd ""
// node ./src/bin/cypherEnv.js decrypt --fr ./src/bin/message.crypt --to ./src/bin/message2.js --pswd ""
