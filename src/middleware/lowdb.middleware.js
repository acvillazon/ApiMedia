/* eslint-disable import/prefer-default-export */
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const fs = require('fs');

async function getConnection(req, _, next) {
  try {
    const async = new FileAsync('db.json');
    const db = await low(async);
    req.db = db;
    next();
  } catch (error) {
    console.log(error);
  }
}

class LOWDB {
  db;

  async createDB() {
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

module.exports = {
  LOWDB,
  getConnection,
};
