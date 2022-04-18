const express = require('express')

const router = express.Router()
const userController = require('../controllers/user-controller') // 新增user controller
const admin = require('./modules/admin') // 新增這行，載入 admin.js
const restController = require('../controllers/restaurant-controller')// 新增，載入 controller
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin) // 新增後台
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler) // 加入這行

module.exports = router
