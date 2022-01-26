const express = require('express')
const app = require('../app')
const router = express.Router()

const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/restaurants', restaurantController.getRestaurants)
router.get('/', (req, res) => { res.redirect('/restaurants') })

module.exports = router
