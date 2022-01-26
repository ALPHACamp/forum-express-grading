const express = require('express')
const router = express.Router()
const restaurantController = require('../controllers/restaurant-controllers')

router.get('/restaurants', restaurantController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
