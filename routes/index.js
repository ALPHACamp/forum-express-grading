const express = require('express')
const router = express.Router()
const resController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/restaurants', resController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
