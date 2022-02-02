const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurant)
router.get('/', (req, res) => res.redirect('/restaurants'))
module.exports = router
