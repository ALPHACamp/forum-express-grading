const express = require('express')
const router = express.Router()
const admin = require('./modules/admin') // 新增這行，載入 admin.js

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller') // 新增這行

router.use('/admin', admin) // 新增這行

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) // 注意用 post

router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

router.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = router
