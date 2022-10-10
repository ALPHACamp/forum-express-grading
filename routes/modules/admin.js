const express = require('express')
const router = express.Router()
const adminCOntroller = require('../../controllers/admin-controller')

router.get('/restaurants', adminCOntroller.getRestaurants)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
