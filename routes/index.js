const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
router.get('/restaurants', restController.getRestaurants)
// fallback route
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
