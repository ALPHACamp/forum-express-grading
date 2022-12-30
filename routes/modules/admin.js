const express = require('express')
const router = express.Router()

// Controllers
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants', adminController.getRestaurants)

// fallback 路由，其他路由條件都不符合時，最終會通過此路由
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
