const express = require('express')
const router = express.Router()

// 載入 controller
const restController = require('../controllers/restaurant-controller')

// 條件較多的 route 盡量往前面

router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
