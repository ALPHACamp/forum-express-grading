const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')

// 建立路由
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
