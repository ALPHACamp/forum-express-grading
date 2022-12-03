const express = require('express')
const router = express.Router()

const passport = require('../config/passport') // 引入 Passport，需要他幫忙做驗證
const upload = require('../middleware/multer')
// 新增，載入 controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller') // 新增這行
const commentController = require('../controllers/​​comment-controller') // 引入 controller
const { authenticated, authenticatedAdmin } = require('../middleware/auth')// 引入 auth.js
const { generalErrorHandler } = require('../middleware/error-handler')
// 載入 admin.js
const admin = require('./modules/admin')

router.use('/admin', authenticatedAdmin, admin)

// router.get('/', (req, res) => {
//   res.send('Hello World!')
// })

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) // 注意用 post

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post
router.get('/logout', userController.logout)

router.get('/users/top', authenticated, userController.getTopUsers) // 新增美食達人的路由

router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)
router.get('/users/:id', authenticated, userController.getUser)

router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants) // 修改這行，新增 authenticated 參數

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment) // 加入刪除的路由
router.post('/comments', authenticated, commentController.postComment) // 加入路由設定

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

// 追蹤的對象是「某個使用者」，因此這邊動態路由是取 :userId
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.use('/', (req, res) => res.redirect('/restaurants'))

router.use('/', generalErrorHandler)

module.exports = router
