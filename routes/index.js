const express = require('express')
const router = express.Router()

const admin = require('./modules/admin.js')

const restController = require('../controllers/restaurant-controller.js')
const userController = require('../controllers/user-controller.js')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)

router.post('/signup', userController.signUp)

router.get('/restaurants', restController.getRestaurants)

router.get('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
