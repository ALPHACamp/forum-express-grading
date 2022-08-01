const router = require('express').Router()
const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('restaurants'))

module.exports = router
