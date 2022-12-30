const express = require('express')
const router = express.Router()

// Controllers
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
// Error handler (middle)
const { generalErrorHandler } = require('../middleware/error-handler')
// 後台
const admin = require('./modules/admin')
router.use('/admin', admin)

// 前台
router.get('/restaurants', restController.getRestaurants)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
// 發生 Error
router.use('/', generalErrorHandler)

// fallback 路由，其他路由條件都不符合時，最終會通過此路由
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
