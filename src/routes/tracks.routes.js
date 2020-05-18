const { Router } = require('express');

const router = new Router();
const { upload } = require('../middleware/multer.audio.middleware');
const { authorize } = require('../middleware/authorize');

const tracksController = require('../controllers/tracks.controller');

router.get('/tracks', authorize, tracksController.getTracks);
router.get('/tracks/:id', tracksController.getTrack);
router.get('/tracks/details/:id', authorize, tracksController.getTrack);
router.post('/tracks', [authorize, upload], tracksController.uploadTrack);
router.delete('/tracks/:id', authorize, tracksController.deleteTrack);

module.exports = router;
