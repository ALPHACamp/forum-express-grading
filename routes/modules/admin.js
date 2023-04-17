const express = require('express')
const router = express.Router()

const { authenticatedAdmin } = require('../../middleware/auth.js')
const adminController = require('../../controllers/admin-controller.js')

router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants)

router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router