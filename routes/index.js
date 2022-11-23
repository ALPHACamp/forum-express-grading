const express = require('express')
const router = express.Router()
//新增，載入 controller

const restController = require('../controllers/restaurant-controller')
//新增
const admin = require('./modules/admin') //新增這行，載入 admin.js
const userController = require('../controllers/user-controller') //新增這行
router.use('/admin', admin) //新增這行

//新增下面這兩行，注意順序
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) //注意用 post

router.get('/restaurants', restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router


module.exports = router
