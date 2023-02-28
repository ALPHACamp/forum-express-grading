const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller') // 因為檔案位置的關係，路徑會多一層
router.get('/restaurants', adminController.getRestaurants)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))
module.exports = router
