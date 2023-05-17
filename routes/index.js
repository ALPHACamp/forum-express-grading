const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
//* 新增，載入 controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
//* 後台路由
router.use('/admin', admin)
//* 使用者路由
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/restaurants', restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
