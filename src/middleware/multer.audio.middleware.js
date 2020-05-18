const multer = require('multer');
const path = require('path');
const { v4: uuid } = require('uuid');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/music'),
  filename: (req, res, cb) => {
    cb(null, uuid() + path.extname(res.originalname).toLowerCase());
  },
});

const upload = multer({
  storage,
  dest: path.join(__dirname, '../public/music'),
  limits: { fields: 2, files: 1, part: 2, fileSize: 12000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = 'mp3|mkv|mpeg';
    const mimetype = file.mimetype.includes('audio');
    const extname = filetypes.includes(path.extname(file.originalname).slice(1));
    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb('Error: Formato de track no soportado');
  },
}).single('track');

const storageVideo = multer.diskStorage({
  destination: path.join(__dirname, '../public/video'),
  filename: (req, res, cb) => {
    cb(null, uuid() + path.extname(res.originalname).toLowerCase());
  },
});

const uploadVideo = multer({
  storage: storageVideo,
  dest: path.join(__dirname, '../public/video'),
  limits: { fields: 2, files: 1, part: 2, fileSize: 32000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = 'mp4|mkv';
    const mimetype = file.mimetype.includes('video');
    const extname = filetypes.includes(path.extname(file.originalname).slice(1));

    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb('Error: Formato de video no soportado');
  },
}).single('video');

module.exports = {
  upload,
  uploadVideo,
};
