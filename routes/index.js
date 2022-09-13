// 存放路由相關邏輯
// 匹配條件較多的路由順序寫在前面，讓程式先判斷。
const express = require('express')
const router = express.Router()
const restaurantController = require('../controller/restaurant-controller')

// 交給 restaurantController.getRestaurants
router.get('/restaurants', restaurantController.getRestaurants)

// fallback 路由：當所有路由皆不匹配時，不管用什麼 HTTP method 發出，最終皆會通過的路由
router.use('/', (req, res) => {
  res.redirect('/restaurants')
})

module.exports = router
