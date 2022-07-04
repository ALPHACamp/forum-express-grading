// FilePath: routes/modules/admin.js
// Include modules
const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

// Router settings
router.get('/restaurants', adminController.getRestaurants)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
