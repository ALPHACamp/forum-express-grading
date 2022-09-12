const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')// 載入 admin.js
const restController = require('../controllers/restaurant-controller')// 載入 controller
const userController = require('../controllers/user-controller')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// 新增前台網址路由//匹配條件多的路由要寫在前面
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
