const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller') // 新增，載入 controller

router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
