const express = require('express')
const router = express.Router()

// 引用錯誤處理 middleware
const { generalErrorHandler } = require('../middleware/error-handler')

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

const admin = require('./modules/admin')

// 管理員
router.use('/admin', admin)

// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// 首頁
router.get('/restaurants', restController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))

// 錯誤處理 middleware
router.use('/', generalErrorHandler)

module.exports = router
