/* For back-end system */

const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin-controller');
const categoryController = require('../../controllers/category-controller')

const upload = require('../../middleware/multer');

// Section all routes
// About restaurants
// note 條件多或最嚴格的的要擺最前面，不然一匹配到就會直接進入該指定的位置
// notice authenticatedAdmin使用太多，抽離到index去見證
router.get('/restaurants/create', adminController.createRestaurant);

router.get('/restaurants/:id/edit', adminController.editRestaurant);

router.get('/restaurants/:id', adminController.getRestaurant);

router.put(
  '/restaurants/:id',
  upload.single('image'),
  adminController.putRestaurant
);

router.get('/restaurants', adminController.getRestaurants);

router.delete('/restaurants/:id', adminController.deleteRestaurant);

router.post(
  '/restaurants',
  upload.single('image'),
  adminController.postRestaurant
);

// About Users
router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)

// About Categories
router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)

router.delete('/categories/:id', categoryController.deleteCategory)

router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)

// Others
router.get('/', (req, res) => {
  res.redirect('/admin/restaurants');
});

module.exports = router;
