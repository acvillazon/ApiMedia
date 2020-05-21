const { Router } = require('express');

const router = new Router();
const { authorize } = require('../middleware/authorize');
const { getConnection } = require('../middleware/lowdb.middleware');
const { upload } = require('../middleware/multer.audio.middleware');

const tracksController = require('../controllers/tracks.controller');

router.get('/tracks', [authorize, getConnection], tracksController.getTracks);
router.get('/tracks/:id', [authorize, getConnection], tracksController.getTrack);
router.get('/tracks/details/:id', [authorize, getConnection], tracksController.getTrack);
router.post('/tracks', [authorize, getConnection, upload], tracksController.uploadTrack);
// router.delete('/tracks/:id', [authorize, getConnection], tracksController.deleteTrack);

module.exports = router;
