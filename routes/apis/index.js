const express = require('express')
const router = express.Router()
// const { authenticated } = require('../../middleware/auth')
const restController = require('../../controllers/apis/restaurant-controller')
router.get('/restaurants', restController.getRestaurants)
module.exports = router
