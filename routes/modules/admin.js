const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin-controller");

//在總路index由加入authenticatedAdmin，這邊就不用重複寫
router.get("/restaurants/create", adminController.createRestaurant);
router.get("/restaurants/:id/edit", adminController.editRestaurant); //冒號後面名稱跟隨controller中的命名
router.get("/restaurants/:rest_id", adminController.getRestaurant); //冒號後面名稱跟隨controller中的命名
router.put("/restaurants/:id", adminController.putRestaurant); // 修改這一行為 put，冒號後面名稱跟隨controller中的命名
router.delete("/restaurants/:id", adminController.deleteRestaurant);
router.get("/restaurants", adminController.getRestaurants);
router.post("/restaurants", adminController.postRestaurant);
router.get("", (req, res) => res.redirect("/admin/restaurants"));
//或寫成 router.use("/", (req, res) => res.redirect("/admin/restaurants"))

module.exports = router;
