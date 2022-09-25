const express = require('express')
const router = express.Router()
const { authenticated } = require('../../middleware/auth')
const restController = require('../../controllers/restaurant-controller')

router.get('/feeds', authenticated, restController.getFeeds)
router.get('/:id/dashboard', authenticated, restController.getDashboard)
router.get('/:id', authenticated, restController.getRestaurant)
router.get('/', authenticated, restController.getRestaurants)

module.exports = router
