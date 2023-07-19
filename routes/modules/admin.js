const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants', adminController.getRestaurants)

router.use('/', async (req, res, next) => {
  try {
    res.redirect('/admin/restaurants')
  } catch (error) {
    next(error)
  }
})

module.exports = router
