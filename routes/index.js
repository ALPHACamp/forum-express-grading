const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/​​comment-controller')
const upload = require('../middleware/multer')
const { generalErrorHandler } = require('../middleware/error-handler') // 須將middleware加入
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')

// 現在收到的請求如果帶有 /admin 的路徑，就一律丟給後台專用的 admin 這個 module 去處理，若是其他情況再依序往下判斷。(使用router.use )。使用authenticatedAdmin驗證是否為admin。
router.use('/admin', authenticatedAdmin, admin)
// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)// 使用post處理signup的動作
// 登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
// 登出
router.get('/logout', userController.logout)

router.get('/users/top', authenticated, userController.getTopUsers)
// user profile
router.get('/users/:id/edit', authenticatedUser, userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticatedUser, upload.single('image'), userController.putUser)

// 前端畫面
// feeds，注意順序，因為 '/restaurants/feeds' 這組字串也符合動態路由 '/restaurants/:id' 的結構，會被視為「:id 是 feeds」而導向單一餐廳的頁面。
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
// dashboard
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)
// 如果接收到的請求路徑是 / restaurants，那就交給 controller 的 getRestaurants 函式來處理。如果這行路由和請求匹配成功，以下的 router.get 就不會執行。

// comment路由
router.delete('/comments/:id', authenticated, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

// favorite
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

// Like
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

// followship
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)
// fallback路由。當其他路由條件都不符合時，最終會通過的路由。論此 request 是用哪個 HTTP method 發出的，都會匹配到這一行，將使用者重新導回 / restaurants。所以要注意順序。所以就是不論你網址亂打甚麼，他都會跳去/restaurants。
router.get('/', (req, res) => { res.redirect('/restaurants') })

router.use('/', generalErrorHandler) // 須將middleware加入，不然無法顯示

module.exports = router
