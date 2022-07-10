const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const admin = require('./modules/admin') // 新增這行，載入 admin.js
router.use('/admin', admin) // 新增這行
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) // 注意用 post

router.get('/restaurants', restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler) // 加入這行
module.exports = router
