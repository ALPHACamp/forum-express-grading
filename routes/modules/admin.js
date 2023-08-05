const express = require('express')
const adminController = require('../../controllers/admin-controller')

const router = express.Router()

router.get('/restaurants', adminController.getRestaurants)

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
