/* eslint-disable consistent-return */
const fs = require('fs');
const l = require('lodash');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('../bin/getEnv').get();

const { exits, getTracksJSON, SearchImage, AddTodbJson } = require('../bin/spotify.api');

exports.getTracks = (req, res) => {
  const skip = req.body.skip || 0;
  const limit = req.body.limit || 20;

  try {
    if (exits('tracks.json')) {
      getTracksJSON('tracks.json', (_, tracks) => {
        if (_) return res.status(400).json({ _ });

        const response = l.filter(JSON.parse(tracks).tracks, (v, i) => {
          if (i >= skip && i <= limit) {
            return v;
          }
        });
        res.status(200).json(response);
      });
    } else {
      return res.status(404).json({ error: 'file dont exist' });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.deleteTrack = (req, res) => {
  try {
    const { id } = req.params;
    const pathFile = `${path.dirname(__dirname)}/public/music/${id}`;

    if (!exits(pathFile)) return res.json({ error: 'file dont exist' });

    fs.unlink(pathFile, (err) => {
      if (err) return res.json({ err, message: 'Error al eliminar archivo' });
      res.json({ result: 'Archivo fue borrado' });
    });
  } catch (error) {
    return res.json({ error });
  }
};

exports.uploadTrack = async (req, res) => {
  try {
    req.file.nameInput = req.body.name;
    req.file.author = req.body.author;

    await SearchImage(req);
    AddTodbJson('tracks.json', req);

    res.json({ file: req.body.name, filename: req.file, result: 'the file was saved' });
  } catch (error) {
    res.json({ error });
  }
};

exports.getTrack = (req, res) => {
  const { token } = req.query;

  // eslint-disable-next-line no-unused-vars
  jwt.verify(token, config.key_toen, (err, decode) => {
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
