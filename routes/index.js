const express = require('express')
const router = express.Router()

const passport = require('../config/passport') // 引入Passport,透過他幫忙做驗證

const admin = require('./modules/admin')// 載入 admin.js

const restController = require('../controllers/restaurant-controller')// 載入 controller
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/​​comment-controller')

const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticatedUser, upload.single('image'), userController.putUser)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/users/:id/edit', authenticatedUser, userController.editUser)

router.get('/logout', userController.logout)

router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
// 新增前台網址路由//匹配條件多的路由要寫在前面
router.get('/restaurants', authenticated, restController.getRestaurants)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
