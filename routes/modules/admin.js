const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

// user has signed in && is admin >> call function `adminController.getRestaurants`
router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.get('/', (req, res) => res.redirect('admin/restaurants'))

module.exports = router
