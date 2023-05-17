const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controllers')
const { authenticatedAdmin } = require('../../middleware/auth')
router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants)

router.use('/', (req, res) => { res.redirect('/admin/restaurants') })

module.exports = router
