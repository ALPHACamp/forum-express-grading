const express = require('express')
const router = express.Router()
const passport = require('passport')

const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

// 引入路由模組
const admin = require('./modules/admin')

// 建立admin相關路由，先經由authenticatedAdmin驗証是否有admin權限
router.use('/admin', authenticatedAdmin, admin)

// signup相關路由
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// signin相關路由
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/restaurants', authenticated, restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

// 加入錯誤訊息的middleware
router.use('/', generalErrorHandler)

module.exports = router
