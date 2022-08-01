const router = require('express').Router()
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants', adminController.getRestaurants)
router.use('/', (req, res) => res.redirect('restaurants'))

module.exports = router
