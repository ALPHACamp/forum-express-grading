const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')
const UserController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handeler')

router.use('/admin', admin)
router.get('/signup', UserController.signUpPage)
router.post('/signup', UserController.signUp)
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants')) // fallback route
router.use('/', generalErrorHandler)

module.exports = router
