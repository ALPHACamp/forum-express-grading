const express = require('express');

const router = express.Router();
//* 載入子路由
const admin = require('./modules/admin');

//* 載入controller
const restController = require('../controllers/restaurant-controller');

router.use('/admin', admin);
router.get('/restaurants', restController.getRestaurants);

router.use('/', (req, res) => res.redirect('/restaurants'));

module.exports = router;
