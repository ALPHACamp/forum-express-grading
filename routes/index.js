// 存放路由相關邏輯
// 匹配條件較多的路由順序寫在前面，讓程式先判斷。
const express = require('express')
const router = express.Router()
const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler') // { key:value }

// 因為這邊是設立在 routes/modules 路由清單裡面
router.use('/admin', admin) // global

// 將 req 交給 userController.signUpPage
router.get('/signup', userController.signUpPage)

// 將 req 交給 userController.signUp
router.post('/signup', userController.signUp)

// 將 req 交給 restaurantController.getRestaurants
router.get('/restaurants', restaurantController.getRestaurants)

// fallback 路由：當所有路由皆不匹配時(奇怪亂拼湊)，不管用什麼 HTTP method 發出，最終皆會通過的路由(e.g. http://localhost:3000/)
router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

router.use('/', generalErrorHandler) // global //因為寫了 / 所以只要匹配(其實就是所有路徑就會走這邊，但是是最後再走這邊嗎?????因為要先有執行路徑內的 logic 才有 error 機會產生????)
module.exports = router
