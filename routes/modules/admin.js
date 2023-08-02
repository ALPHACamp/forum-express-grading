const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
// const { authenticatedAdmin } = require('../../middleware/auth')
router.get('/restaurants', adminController.getRestaurants)
router.get('/restaurants/create', adminController.createRestaurant)
router.post('/restaurants', adminController.postRestaurant)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
