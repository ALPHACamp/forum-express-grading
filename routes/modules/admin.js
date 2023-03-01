const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

const { authenticatedAdmin } = require('../../middleware/auth') // 導入登入驗證

router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants) // 導入登入狀態驗證
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
