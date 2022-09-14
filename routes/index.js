// 存放路由相關邏輯
// 匹配條件較多的路由順序寫在前面，讓程式先判斷。
const express = require('express')
const router = express.Router()
const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')

// 因為這邊是設立在 routes/modules 路由清單裡面
router.use('/admin', admin)

// 將 req 交給 restaurantController.getRestaurants
router.get('/restaurants', restaurantController.getRestaurants)

// 將 req 交給 userController.signUpPage
router.get('/signup', userController.signUpPage)

// 將 req 交給 userController.signUp
router.post('/signup', userController.signUp)

// fallback 路由：當所有路由皆不匹配時，不管用什麼 HTTP method 發出，最終皆會通過的路由
router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

module.exports = router
