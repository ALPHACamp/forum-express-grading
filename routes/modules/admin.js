const express = require('express')
const router = express.Router()

const { authenticatedAdmin } = require('../../middleware/auth')
const adminController = require('../../controllers/restaurnat-controller')

router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
