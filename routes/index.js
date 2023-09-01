const express = require('express')
const router = express.Router()

const passport = require('../config/passport') // 引入 Passport，需要他幫忙做驗證

const admin = require('./modules/admin') // 新增這行，載入 admin.js

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller') // 新增這行

const { generalErrorHandler } = require('../middleware/error-handler') // 加入這行

router.use('/admin', admin) // 新增這行

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) // 注意用 post

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post

router.get('/logout', userController.logout)

router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

router.use('/', generalErrorHandler) // 加入這行

module.exports = router
