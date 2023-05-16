const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin-controller");
const { authenticatedAdmin } = require("../../middleware/auth");
//刪除

//新增

router.get("/restaurants", authenticatedAdmin, adminController.getRestaurants);

router.use("/", (req, res) => res.redirect("/admin/restaurants"));

module.exports = router;
