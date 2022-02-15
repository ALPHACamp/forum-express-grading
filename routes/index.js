const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurants-controller')
const admin = require('./modules/admin')
router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
