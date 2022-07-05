const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth') // 引入 auth.js
router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants) // 修改這行，新增 authenticatedAdmin 參數
router.get('', (req, res) => res.redirect('/admin/restaurants'))
module.exports = router
