const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const addressController = require('../../controllers/address.controller');

const router = express.Router();

router.get('/', auth(), addressController.getAddress);
router.get('/parse', auth(), addressController.getAddressByCoordinate);
router.get('/:id', auth(), addressController.getAddressById);
module.exports = router;
