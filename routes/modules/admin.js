const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')

// create
router.get('/restaurants/create', adminController.createRestaurant) // create page
router.get('/restaurants/:id/edit', adminController.editRestaurant) // edit page
router.get('/restaurants/:id', adminController.getRestaurant) // detail
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant) // edit
router.delete('/restaurants/:id', adminController.deleteRestaurant) // delete
router.get('/restaurants', adminController.getRestaurants) // home page
router.post('/restaurants', upload.single('image'), adminController.postRestaurant) // create
router.get('/', (req, res) => {
  return res.redirect('/admin/restaurants')
})
module.exports = router
