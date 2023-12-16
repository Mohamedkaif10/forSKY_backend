const express = require('express');
const router = express.Router();
const {updatePassword} = require('../functions/otp')

router.put('/update-password',updatePassword)

module.exports = router