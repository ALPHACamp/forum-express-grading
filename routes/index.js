const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')

// admin
router.use('/admin', admin)

// sign up
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// restaurants
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
