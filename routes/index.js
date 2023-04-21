const express = require('express')
const router = express.Router()
const restaurantController = require('../controllers/restaurant-controller')

router.get('/', (req, res) => res.redirect('/restaurant'))

router.get('/restaurant', restaurantController.getRestaurants)

module.exports = router
