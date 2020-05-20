/* eslint-disable import/prefer-default-export */
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const fs = require('fs');

class LOWDB {
  db;

  async doConexion() {
    const exit = fs.existsSync('db.json');
    if (exit) return;

    await this.getDB();
    this.db.defaults({ tracks: [], videos: [] }).write();
  }

  async getDB() {
    const async = new FileAsync('db.json');
    this.db = await low(async);
    return this.db;
  }
}

module.exports = new LOWDB();
