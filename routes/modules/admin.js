const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const { adminAuthenticated } = require('../../middleware/auth')

router.get('/restaurants', adminAuthenticated, adminController.getRestaurants)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
