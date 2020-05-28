/* eslint-disable consistent-return */
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { v1: uuid } = require('uuid');
const { exits, SearchImage } = require('../bin/spotify.api');

exports.getTracks = async (req, res) => {
  const skip = req.body.skip || 0;
  const limit = req.body.limit || 20;

  try {
    const tracks = await req.db.get('tracks').slice(skip).take(limit).value();

    res.status(200).json({ tracks });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// exports.deleteTrack = (req, res) => {};

exports.uploadTrack = async (req, res) => {
  try {
    req.file.nameInput = req.body.name;
    req.file.author = req.body.author;

    await SearchImage(req);
    req.db
      .get('tracks')
      .push(req.file)
      .last()
      .assign({ id: uuid() })
      .write()
      .then((file) => {
        res.status(200).json({
          file: req.body.name,
          filename: file,
          result: 'the file was saved',
        });
      })
      .catch((error) => {
        res.status(500).json({
          error,
          result: 'Something was wrong',
        });
      });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getTrack = (req, res) => {
  const { token } = req.query;

  // eslint-disable-next-line no-unused-vars
  jwt.verify(token, process.env.KEY_TOKEN, (err, decode) => {
    if (err) {
      return req.status(400).json({ err: { message: 'The token is not valid' } });
    }
    const { id } = req.params;
    const pathFile = `${path.dirname(__dirname)}/public/music/${id}`;

    if (!exits(pathFile)) return res.json({ err: { message: 'file dont exist' } });

    const stat = fs.statSync(pathFile);
    const fileSize = stat.size;
    const { range } = req.headers;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(pathFile, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mp3',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mp3',
      };
      res.writeHead(200, head);
      fs.createReadStream(pathFile).pipe(res);
    }
  });
};
