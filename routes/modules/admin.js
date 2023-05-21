const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants) // 進入/restaurants前先驗證是否為adm，是才能帶入adm畫面
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
