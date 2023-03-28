const express = require('express')
const router = express.Router()

// 新增，載入 controller
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')  //引入 auth.js 
router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants)  // 修改這行，新增 authenticatedAdmin 參數

// 新增
router.get('/restaurants', adminController.getRestaurants)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
