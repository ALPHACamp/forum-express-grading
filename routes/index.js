const express = require('express')
const router = express.Router()

// 載入 controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')

const { authenticated } = require('../middleware/auth')
const { authenticatedAdmin } = require('../middleware/auth')
// 錯誤處理
const { generalErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')
const admin = require('./modules/admin')
// 條件較多的 route 盡量往前面

router.use('/admin', authenticatedAdmin, admin)
// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
// 登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 Post
router.get('/logout', userController.logout)

router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
