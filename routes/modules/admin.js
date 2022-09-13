const router = require('express').Router()
const adminController = require('../../controller/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/restaurants', authenticatedAdmin, adminController.getRestaurant)
router.use('/', (req, res) => { res.redirect('admin/restaurants') })

module.exports = router
