const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
//* 新增，載入 controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
//* 錯誤處理
const { generalErrorHandler } = require('../middleware/error-handler')
//* 後台路由
router.use('/admin', authenticatedAdmin, admin)
//* 使用者路由
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
)
router.get('/logout', userController.logout)

router.get('/restaurants', authenticated, restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
