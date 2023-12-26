const express = require('express');
const auth = require('../../middlewares/auth');
const areaForestController = require('../../controllers/area_forest.controller');

const router = express.Router();

router
  .route('/area-forest')
  .get(auth(), areaForestController.getAreaForests);

router
.route('/')
.get(auth(), areaForestController.getIQAir);
module.exports = router;