const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')
const { generalErrorHandler } = require('../../middleware/error-handler')

router.get('/restaurants/create', adminController.createRestaurant) // page of create
router.get('/restaurants/:rest_id/edit', adminController.editRestaurant) // page of edit
router.get('/restaurants/:rest_id', adminController.getRestaurant) // show a restaurant
router.put('/restaurants/:rest_id', upload.single('image'), adminController.putRestaurant) // update a restaurant
router.delete('/restaurants/:rest_id', adminController.deleteRestaurant) // delete a restaurant
router.patch('/users/:id', adminController.patchUser) // switch admin <=> user
router.post('/restaurants', upload.single('image'), adminController.postRestaurant) // create a restaurant
router.get('/restaurants', adminController.getRestaurants) // show all restaurants
router.get('/users', adminController.getUsers) // show all users
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

router.use('/', generalErrorHandler)
module.exports = router
