const {Router} = require("express");
const router = new Router();
const {upload} = require("../middleware/multer.audio.middleware");

const tracksController = require("../controllers/tracks.controller");


router.get("/getTracks",tracksController.getTracks);
router.post("/uploadTrack",upload,tracksController.uploadTrack);
router.get("/getTrack/:id",tracksController.getTrack);
router.get("/deleteTrack/:id",tracksController.deleteTrack);

module.exports = router;
