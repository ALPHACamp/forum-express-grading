const express = require('express')
const router = express.Router()
// 新增，載入 controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller') // 新增這行
const { generalErrorHandler } = require('../middleware/error-handler')
// 載入 admin.js
const admin = require('./modules/admin')

router.use('/admin', admin)

router.get('/', (req, res) => {
  res.send('Hello World!')
})

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) // 注意用 post
// 新增
router.get('/restaurants', restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))

router.use('/', generalErrorHandler)

module.exports = router
