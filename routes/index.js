const express = require('express')
const router = express.Router()

const passport = require('../config/passport') // 導入登入提示狀態

const admin = require('./modules/admin') // 導入後台管理

const restController = require('../controllers/restaurant-controller') // 導入餐廳控制
const userController = require('../controllers/user-controller') // 導入使用者控制

const { authenticated, authenticatedAdmin } = require('../middleware/auth') // 導入登入驗證,新增後台管理驗證

const { generalErrorHandler } = require('../middleware/error-handler') // 導入錯誤訊息提示

router.use('/admin', authenticatedAdmin, admin) // 一開始就做後台管理驗證

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 加入登入錯誤等提示

router.get('/logout', userController.logout)

router.get('/restaurants', authenticated, restController.getRestaurants) // 導入登入狀態驗證
router.use('/', (req, res) => res.redirect('/restaurants'))

router.use('/', generalErrorHandler)

module.exports = router
