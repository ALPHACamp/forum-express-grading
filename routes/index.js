const express = require('express')

const router = express.Router()

// 新增，載入 controller

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin') // 新增這行，載入 admin.js
router.use('/admin', admin) // 新增這行
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/restaurants', restController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))
// 新增

router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
