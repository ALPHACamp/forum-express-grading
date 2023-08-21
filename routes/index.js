const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurants-controller')
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')

const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/restaurants', restController.getRestaurants)
router.use('/admin', admin)
router.get('/signup', userController.signupPage)
router.post('/signup', userController.signup)
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
