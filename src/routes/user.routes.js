const express = require('express');

const router = express.Router();
const { authorize } = require('../middleware/authorize');
const controller = require('../controllers/user.controller');

router.post('/signIn', controller.signIn);
router.post('/logIn', controller.logIn);
router.get('/user/:id', authorize, controller.getUser);
router.get('/email/:id/exist', controller.getExist);

module.exports = router;
