const router = require('express').Router()
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants', adminController.getRestaurants)
router.get('/restaurants/create', adminController.getCreateRestaurantPage)
router.post('/restaurants', adminController.postRestaurant)
router.use('/', (req, res) => res.redirect('restaurants'))

module.exports = router
