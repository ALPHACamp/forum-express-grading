const express = require('express')
const admin = require('./modules/admin')
const restController = require('../controllers/restaurant-controller')
const router = express.Router()

router.use('/admin', admin)

router.get('/restaurants', restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
