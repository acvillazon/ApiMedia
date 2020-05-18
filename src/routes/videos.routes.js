const { Router } = require('express');

const router = new Router();
const { uploadVideo } = require('../middleware/multer.audio.middleware');
const videoController = require('../controllers/videos.controller');

router.get('/videos', videoController.getVideos);
router.get('/videos/:id', videoController.getVideo);
router.post('/videos', uploadVideo, videoController.uploadVideo);
// router.delete('videos/:id', videoController.deleteVideo);

module.exports = router;
