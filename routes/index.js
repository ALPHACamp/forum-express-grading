const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/​​comment-controller') // 引入 controller
const upload = require('../middleware/multer')
const { authenticated, authenticatedAdmin } = require('../middleware/auth') // 引入 auth.js
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)
router.get('/users/:id/edit', userController.editUser)
router.get('/users/:id', userController.getUser)
router.put('/users/:id', upload.single('image'), userController.putUser)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) // 注意用 post
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post
router.get('/logout', userController.logout)
router.get('/restaurants/feeds', authenticated, restController.getFeeds) // 新增這一行
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant) // 新增這行
router.get('/restaurants', authenticated, restController.getRestaurants)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)// 加入這行
router.post('/comments', authenticated, commentController.postComment) // 加入路由設定
// 新增以下兩行
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
