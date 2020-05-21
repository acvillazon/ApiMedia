const { Router } = require('express');

const router = new Router();
const { authorize } = require('../middleware/authorize');
const { getConnection } = require('../middleware/lowdb.middleware');
const { uploadVideo } = require('../middleware/multer.audio.middleware');

const videoController = require('../controllers/videos.controller');

const middleware = [authorize, getConnection];

router.get('/videos', middleware, videoController.getVideos);
router.get('/videos/:id', middleware, videoController.getVideo);
router.post('/videos', [middleware, uploadVideo], videoController.uploadVideo);
// router.delete('videos/:id', middleware, videoController.deleteVideo);

module.exports = router;
