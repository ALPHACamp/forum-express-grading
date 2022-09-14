const router = require('express').Router()
const adminController = require('../../controller/admin-controller')

router.get('/restaurants', adminController.getRestaurant)
router.post('/restaurants', adminController.postRestaurant)
router.get('/restaurants/create', adminController.createRestaurant)
router.use('/', (req, res) => { res.redirect('admin/restaurants') })

module.exports = router
