const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')

// 現在收到的請求如果帶有 /admin 的路徑，就一律丟給後台專用的 admin 這個 module 去處理，若是其他情況再依序往下判斷。(使用router.use)
router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)// 使用post處理signup的動作
router.get('/restaurants', restController.getRestaurants)
// 如果接收到的請求路徑是 / restaurants，那就交給 controller 的 getRestaurants 函式來處理。如果這行路由和請求匹配成功，以下的 router.get 就不會執行。

// fallback路由。當其他路由條件都不符合時，最終會通過的路由。論此 request 是用哪個 HTTP method 發出的，都會匹配到這一行，將使用者重新導回 / restaurants。所以要注意順序。所以就是不論你網址亂打甚麼，他都會跳去/restaurants。
router.use('/', (req, res) => { res.redirect('/restaurants') })

module.exports = router
