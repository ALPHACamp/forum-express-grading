const express = require('express')
const router = express.Router()
const restaurantController = require('../../controllers/restaurant-controller')

router.get('/:restaurantId/dashboard', restaurantController.getDashBoard)
router.get('/:restaurantId', restaurantController.getRestaurant)
router.get('', restaurantController.getRestaurants)

module.exports = router
