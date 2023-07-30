const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')

router.get('/restaurants', restController.getRestaurants)

// fallback路由，當其他條件都不符合，最終都會通過這一條
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
