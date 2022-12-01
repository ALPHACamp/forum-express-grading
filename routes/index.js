const express = require('express')
const router = express.Router()
const passport = require('../config/passport') // 引入 Passport，需要他幫忙做驗證
// 新增，載入 controller
const userController = require('../controllers/user-controller') // 新增這行
const restController = require('../controllers/restaurant-controller')
// 新增
const commentController = require('../controllers/comment-controller') // 引入 controller
//....
const upload = require('../middleware/multer')

const { authenticated, authenticatedAdmin } = require('../middleware/auth') // 修改這一行

 const admin = require('./modules/admin') 
const { generalErrorHandler } = require('../middleware/error-handler') // 加入這行

router.use('/admin', authenticatedAdmin, admin) // 修改這一行

// 新增下面這兩行，注意順序
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) // 注意用 post

router.get('/signin', userController.signInPage)

router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post

router.get('/logout', userController.logout)
router.get('/users/top', authenticated, userController.getTopUsers) //新增這一行
router.get('/users/:id/edit', authenticated, userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get(
  '/restaurants/:id/dashboard',
  authenticated,
  restController.getDashboard
)
router.get('/restaurants/:id', authenticated, restController.getRestaurant) // 新增這行
router.get('/restaurants', authenticated, restController.getRestaurants)



router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment) // 加入這行
router.post('/comments', authenticated, commentController.postComment) // 加入路由設定
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler) // 加入這行
module.exports = router

module.exports = router
