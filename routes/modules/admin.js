const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin-controller");

router.get("/restaurants/create", adminController.createRestaurant);
router.get('/restaurants/:id/edit', adminController.editRestaurant) // 新增這一行
router.get('/restaurants/:id', adminController.getRestaurant) //新增這一行
router.put("/restaurants/:id", adminController.putRestaurant);
router.get("/restaurants", adminController.getRestaurants);
router.post("/restaurants", adminController.postRestaurant);


router.use("/", (req, res) => res.redirect("/admin/restaurants"));
module.exports = router;
