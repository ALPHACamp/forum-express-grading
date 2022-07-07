const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const { authenticateAdmin } = require('../../middleware/auth')

router.get('/restaurants', authenticateAdmin, adminController.getRestaurants)
router.get('/', (req, res) => {
  res.redirect('/admin/restaurants')
})

module.exports = router
