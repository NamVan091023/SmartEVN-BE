const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const pollutionValidation = require('../../validations/pollution.validation');
const pollutionController = require('../../controllers/pollution.controller');

const router = express.Router();
const upload = require('../../middlewares/uploadPollution');

router
  .route('/')
  .post(upload, auth(), validate(pollutionValidation.createPollution), pollutionController.createPollution)
  .get(auth(), validate(pollutionValidation.getPollutions), pollutionController.getPollutions);

router.get('/user', auth(), validate(pollutionValidation.getPollutionsByUser), pollutionController.getPollutionByUserId);
router.get('/stats', pollutionController.getStatsPollution);
router.get('/history', pollutionController.getHistoryPollution);
router.get('/types', pollutionController.getTypesPollution);
router.get('/qualities', pollutionController.getQualityPollution);
router.get('/me' ,auth(), validate(pollutionValidation.getPollutionsCurrentUser), pollutionController.getPollutionsCurrentUser);
router
  .route('/:pollutionId')
  .get(auth(), validate(pollutionValidation.getPollution), pollutionController.getPollution)
  .patch(upload, auth('managePollution'), validate(pollutionValidation.updatePollution), pollutionController.updatePollution)
  .delete(auth('managePollution'), validate(pollutionValidation.deletePollution), pollutionController.deletePollutionById);

module.exports = router;