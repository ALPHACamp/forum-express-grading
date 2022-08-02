const router = require('express').Router()
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.get('/signup', userController.getSignUpPage)
router.post('/signup', userController.signUp)
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('restaurants'))

module.exports = router
