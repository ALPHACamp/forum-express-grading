// modules
const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

// routes
router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

// exports
module.exports = router
