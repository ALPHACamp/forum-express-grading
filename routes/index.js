const router = require('express').Router()
const restController = require('../controllers/restaurant-controller')

router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('restaurants'))

module.exports = router
