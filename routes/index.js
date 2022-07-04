// FilePath: routes/index.js
// Include modules
const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

const { generalErrorHandler } = require('../middleware/error-handler')

// Router settings
// admins
router.use('/admin', admin)
// users
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
// restaurants
router.get('/restaurants', restController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))
// fallback
router.use('/', generalErrorHandler)

module.exports = router
