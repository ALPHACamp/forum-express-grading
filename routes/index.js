const express = require('express')
const router = express.Router()
const restaurantController = require('../controllers/restaurant-controller')

router.get('/restaurants', restaurantController.getRestaurants) //若接收到的請求路徑=restaurants則交由controller處理

router.use('/', (req, res) => {
  res.redirect('/restaurants')
})
module.exports = router
