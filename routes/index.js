const express = require('express')
const router = express.Router()
const restaurantController = require('../controllers/restaurant-controller.js')
const userController = require('../controllers/user-controller.js')
const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler')
router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/restaurants', restaurantController.getRestaurants)
router.use('/', generalErrorHandler)
router.get('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
