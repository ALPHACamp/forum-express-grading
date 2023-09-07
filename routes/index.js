const express = require('express')
const router = express.Router()

const restaurantController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.get('/restaurants', restaurantController.getRestaurants)
router.get('/', (_req, res) => {
  res.send('Hello World!')
})

module.exports = router
