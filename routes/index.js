const express = require('express')
const router = express.Router()

// Controllers
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
// 後台
const admin = require('./modules/admin')
router.use('/admin', admin)

// 前台
router.get('/restaurants', restController.getRestaurants)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// fallback 路由，其他路由條件都不符合時，最終會通過此路由
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
