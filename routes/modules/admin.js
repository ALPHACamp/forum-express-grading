const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controllers')

router.get('/restaurants', adminController.getRestaurants)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
