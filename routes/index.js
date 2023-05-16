const express = require("express");
const restaurantController = require("../controllers/restaurant-controller");
const router = express.Router();

router.get("/restaurants", restaurantController.getRestaurants);
router.use("/", (req, res) => res.redirect("/restaurants"));

module.exports = router;
