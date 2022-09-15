const express = require('express')
const router = express.Router()
const restaurantController = require('../controllers/restaurant-controller')

router.get('/restaurant', restaurantController.getRestaurants)

router.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = router
