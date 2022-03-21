const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')
router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get(('/', (req, res) => { res.redirect('/restaurants') }))

module.exports = router
