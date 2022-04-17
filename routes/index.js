const express = require('express')

const router = express.Router()

const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
//
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
