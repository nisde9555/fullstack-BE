const express = require('express');

const homeControllers = require('../controllers/home');

const router = express.Router();

router.get('', homeControllers.getHome);

module.exports = router;