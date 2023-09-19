const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')

const restaurantController = require('../controllers/restaurants-controllers')
const userController = require('../controllers/user-controller')
const { errorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)

router.post('/signup', userController.signUp)

router.get('/restaurants', restaurantController.getRestaurants)

router.get('/', (req, res) => res.redirect('/restaurants'))

router.use('/', errorHandler)

module.exports = router
