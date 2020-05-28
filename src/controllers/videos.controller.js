const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { v1: uuid } = require('uuid');
const { exits } = require('../bin/spotify.api');

exports.getVideos = async (req, res) => {
  const skip = req.body.skip || 0;
  const limit = req.body.limit || 20;
  try {
    const videos = await req.db.get('videos').slice(skip).take(limit).value();

    res.json({ videos });
  } catch (error) {
    return res.json({ error });
  }
};

exports.uploadVideo = (req, res) => {
  try {
    req.file.titleVideo = req.body.name;
    req.file.authorVideo = req.body.author;

    req.db
      .get('videos')
      .push(req.file)
      .last()
      .assign({ id: uuid() })
      .write()
      .then((file) => {
        res.json({
          file: req.body.name,
          filename: file,
          result: 'the file was saved',
        });
      })
      .catch((error) => {
        res.json({
          error,
          result: 'Something was wrong',
        });
      });
  } catch (error) {
    res.json({ error });
  }
};

exports.getVideo = (req, res) => {
  const { token } = req.query;

  // eslint-disable-next-line no-unused-vars
  jwt.verify(token, process.env.KEY_TOKEN, (err, _) => {
    if (err) {
      return req.status(400).json({ err: { message: 'The token is not valid' } });
    }

    const { id } = req.params;
    const pathFile = `${path.dirname(__dirname)}/public/video/${id}`;

    if (!exits(pathFile))
      return res.json({
        error: 'file dont exist',
      });

    const stat = fs.statSync(pathFile);
    const fileSize = stat.size;
    const { range } = req.headers;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(pathFile, {
        start,
        end,
      });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(pathFile).pipe(res);
    }
  });
};

// exports.deleteVideo = (req, res) => {};
