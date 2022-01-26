const express = require('express')
const router = express.Router()

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

module.exports = router
