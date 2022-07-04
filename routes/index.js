const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')

router.get('/restaurants', restController.getRestaurants) // 收到請求路徑是GET /restaurants，就交給 restController 的 getRestaurants 函式來處理。

router.use('/', (req, res) => {
  res.redirect('/restaurants')
})

module.exports = router
