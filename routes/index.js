const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/restaurant', restaurantController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurant'))
router.use('/', generalErrorHandler)

module.exports = router
