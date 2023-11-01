const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const restController = require('../controllers/restaurant-controller') // 載入 controller
const userController = require('../controllers/user-controller')
const { authenticated } = require('../middleware/auth') // 引入用來驗證是否登入
const { authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const admin = require('./modules/admin')

router.use('/admin', authenticatedAdmin, admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signIn
) // 注意是 post
router.get('/logout', userController.logout)
router.get('/restaurants/:id', restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants')) // 設定fallback 路由，其他路由條件都不符合時，最終會通過的路由。
router.use('/', generalErrorHandler)

module.exports = router
