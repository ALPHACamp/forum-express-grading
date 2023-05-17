const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const passport = require('../config/passport') // 引入 Passport，需要他幫忙做驗證
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post
router.get('/logout', userController.logout)
router.get('/restaurants', restController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

// 設定前台路由

module.exports = router
