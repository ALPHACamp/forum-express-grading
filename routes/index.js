const express = require('express')
const router = express.Router()

// Controllers
const restController = require('../controllers/restaurant-controller')

router.get('/restaurants', restController.getRestaurants)

// fallback 路由，其他路由條件都不符合時，最終會通過此路由
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
