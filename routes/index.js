const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

const admin = require('./modules/admin')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/restaurants', restController.getRestaurants)

// Fallback route, if there is no match route from top to bottom, redirect this route
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
