const {Router} = require("express");
const router = new Router();
const {uploadVideo} = require("../middleware/multer.audio.middleware");
const videoController = require("../controllers/videos.controller");

router.get("/getVideos",videoController.getVideos);
router.post("/uploadVideo",uploadVideo,videoController.uploadVideo);

router.get("/getVideo/:id",videoController.getVideo);
router.get("/deleteVideo/:id",videoController.deleteVideo);

module.exports = router;
