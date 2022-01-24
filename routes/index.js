const express = require('express')
const router = express.Router()

const { generalErrorHandler } = require('../middleware/error-handler')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

// 引入路由模組
const admin = require('./modules/admin')

// 建立路由
router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

// 加入錯誤訊息的middleware
router.use('/', generalErrorHandler)

module.exports = router
