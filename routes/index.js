const express = require('express')
const router = express.Router()

// 新增，載入controller
const admin = require('./modules/admin')
const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
// 注意順序
router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/restaurants', restaurantController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
