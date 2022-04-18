const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/restaurant', adminController.getRestaurants)
router.get('/', (req, res) => res.redirect('/admin/restaurant'))
module.exports = router
