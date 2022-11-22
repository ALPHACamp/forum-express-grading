const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin-controller");

//在總路index由加入authenticatedAdmin，這邊就不用重複寫
router.get("/restaurants/create", adminController.createRestaurant);
router.get("/restaurants", adminController.getRestaurants);
router.post("/restaurants", adminController.postRestaurant);
router.get("", (req, res) => res.redirect("/admin/restaurants"));
//或寫成 router.use("/", (req, res) => res.redirect("/admin/restaurants"))

module.exports = router;
