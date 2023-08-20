const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.use('/restaurants', adminController.getRestaurants)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
