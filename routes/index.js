const express = require('express')
const router = express.Router()

// 載入 Controllers
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

// Admin
const admin = require('./modules/admin')
router.use('/admin', admin)

// Sign up
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))
module.exports = router
