const express = require('express')
const router = express.Router()
const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const admin = require('./modules/admin')

router.use('/admin', admin)

// router順序非常重要，條件越複雜的越要往上放，讓程式先判斷
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) // 注意用 post
router.get('/restaurants', restaurantController.getRestaurants)
router.get('/', (req, res) => { res.redirect('/restaurants') })
router.use('/', generalErrorHandler)

module.exports = router
