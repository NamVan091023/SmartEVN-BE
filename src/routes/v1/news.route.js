const express = require('express');
const auth = require('../../middlewares/auth');
const newsController = require('../../controllers/news.controller');

const router = express.Router();

router
  .route('/')
  .get(auth(), newsController.getNews);
module.exports = router;