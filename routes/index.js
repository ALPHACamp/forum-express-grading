const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurants-controller')
const admin = require('./modules/admin')

router.use('/restaurants', restController.getRestaurants)
router.use('/admin', admin)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
