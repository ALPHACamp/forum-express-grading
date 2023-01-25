const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modles/admin.js')

router.use('/admin', admin)

router.get('/signup', userController.signUppage)
router.post('/signup', userController.signUp)
router.get('/restaurants', restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
