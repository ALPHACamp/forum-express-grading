const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')

router.use('/admin', admin) // 管理者首頁

router.get('/signup', userController.signUpPage) // 使用者註冊頁面

router.post('/signup', userController.signUp) // 使用者註冊

router.get('/restaurants', restController.getRestaurants) // 使用者登入後首頁

router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
