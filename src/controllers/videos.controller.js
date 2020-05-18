/* eslint-disable consistent-return */
const fs = require('fs');
const path = require('path');
const l = require('lodash');
const { exits, getTracksJSON, AddTodbJson } = require('../bin/spotify.api');

exports.getVideos = (req, res) => {
  const skip = req.body.skip || 0;
  const limit = req.body.limit || 20;

  try {
    if (exits('videos.json')) {
      getTracksJSON('videos.json', (_, videos) => {
        if (_) return res.json({ error: _ });
        const response = l.filter(JSON.parse(videos).tracks, (v, i) => {
          if (i >= skip && i <= limit) {
            return v;
          }
        });
        res.json(response);
      });
    } else {
      return res.json({ error: 'file dont exist' });
    }
  } catch (error) {
    return res.json({ error });
  }
};

exports.uploadVideo = (req, res) => {
  try {
    req.file.titleVideo = req.body.name;
    req.file.authorVideo = req.body.author;
    AddTodbJson('videos.json', req);

    res.json({
      file: req.body.name,
      filename: req.file,
      result: 'the file was saved',
    });
  } catch (error) {
    res.json({ error });
  }
};

exports.getVideo = (req, res) => {
  const { id } = req.params;
  const pathFile = `${path.dirname(__dirname)}/public/video/${id}`;

  if (!exits(pathFile)) return res.json({ error: 'file dont exist' });

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
};

// exports.deleteVideo = (req, res) => {};
