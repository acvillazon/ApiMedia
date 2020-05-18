const express = require('express');

const router = express.Router();
const { authorize } = require('../middleware/authorize');
const controller = require('../controllers/chats.controller');

router.post('/backup', authorize, controller.getBackUp); // body:{ skip: 0, limit: 40, populate:true }
router.post('/friend', authorize, controller.addFriend);
router.get('/pending', authorize, controller.getPending);
router.delete('/pending', authorize, controller.deletePending);
router.get('/backup', authorize, controller.getBackUp); // body:{ skip: 0, limit: 40, populate:true }

module.exports = router;
