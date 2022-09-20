const express = require('express')
const router = express.Router()
const restaurantController = require('../../controllers/restaurant-controller')
const { authenticated } = require('../../middleware/auth')

router.get('/feeds', authenticated, restaurantController.getFeeds)
router.get('/:restaurantId/dashboard', restaurantController.getDashboard)
router.get('/:restaurantId', restaurantController.getRestaurant)
router.get('', restaurantController.getRestaurants)

module.exports = router
