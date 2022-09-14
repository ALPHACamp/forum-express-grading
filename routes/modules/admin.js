const router = require('express').Router()
const adminController = require('../../controller/admin-controller')

router.use('/', (req, res, next) => {
  console.log('here is routes/modules/admin.js')
  next()
})

router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', adminController.postRestaurant)
router.get('/restaurants/crate', adminController.createRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.use('/', (req, res) => { res.redirect('admin/restaurants') })

module.exports = router
