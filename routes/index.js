const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const restController = require('../controllers/restaurant-controller')
router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)
// fallback route
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
