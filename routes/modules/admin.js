const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth') // 用來驗證身分是否為管理者

router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants)

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
