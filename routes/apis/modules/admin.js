const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/apis/admin-controller')

router.delete('/restaurants/:id', adminController.deleteRestaurants)
router.get('/restaurants', adminController.getRestaurants)

module.exports = router
