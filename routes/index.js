const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
