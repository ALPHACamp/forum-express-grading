const express = require('express')
const router = express.Router()

// 新增，載入 controller
const restController = require('../controllers/restaurant-controller')

router.get('/restaurants', restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
