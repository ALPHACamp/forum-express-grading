const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin-controller');
//* 新增餐廳
router.get('/restaurants/create', adminController.createRestaurant);
router.post('/restaurants', adminController.postRestaurant);

//* 餐廳詳細
router.get('/restaurants/:id', adminController.getRestaurant);
//* 編輯餐廳資料
router.get('/restaurants/:id/edit', adminController.editRestaurant);
router.put('/restaurants/:id', adminController.putRestaurant);

//* 刪除餐廳
router.delete('/restaurants/:id', adminController.deleteRestaurant);

//* 瀏覽全部餐廳
router.get('/restaurants', adminController.getRestaurants);
router.use('', (req, res) => res.redirect('/admin/restaurants'));
module.exports = router;
