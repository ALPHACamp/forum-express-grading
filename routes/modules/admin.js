const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const { authenticated } = require('../../middleware/auth')

router.get('/restaurants', authenticated, adminController.getRestaurant)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))
module.exports = router
