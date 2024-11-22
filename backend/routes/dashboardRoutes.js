const express = require('express');
const { dashboard } = require('../controllers/dashBoardController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/', verifyToken, dashboard);

module.exports = router;
