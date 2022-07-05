const express = require('express')
const { authenticatedAdmin } = require('../../middleware/auth')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
