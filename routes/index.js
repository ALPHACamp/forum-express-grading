const express = require('express')
const router = express.Router()
const admin = require('./modules/admin') // 載入 admin.js
const restController = require('../controllers/restaurant-controller') // 載入restaurant
const userController = require('../controllers/user-controller') // 載入user
const { generalErrorHandler } = require('../middleware/error-handler') // 載入error-handler

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) // 用post
router.use('/admin', admin) // 使用admin
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler) // 加入這行

module.exports = router
