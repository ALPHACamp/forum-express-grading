const express = require('express')
const router = express.Router()
// 用：可以重新命名
const { restaurantController: restController } = require('../controllers/restaurant-controller')

router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => {
  res.redirect('/restaurants')
})

module.exports = router
