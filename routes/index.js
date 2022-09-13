const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')
const UserController = require('../controllers/user-controller')

router.get('/signup', UserController.signUpPage)
router.post('/signup', UserController.signUp)
router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants')) // fallback route

module.exports = router
