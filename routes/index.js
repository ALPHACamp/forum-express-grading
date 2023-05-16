const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const restController = require("../controllers/restaurant-controller");
const admin = require("./modules/admin");
const userController = require("../controllers/user-controller");
const { generalErrorHandler } = require("../middleware/error-handler");
const { authenticated } = require("../middleware/auth");
router.use("/admin", admin);
router.get("/signup", userController.signUpPage);
router.post("/signup", userController.signUp);
router.get("/restaurants", authenticated, restController.getRestaurants);
router.get("/signin", userController.signInPage);
router.post(
  "/signin",
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
  }),
  userController.signIn
);
router.get("/", (req, res) => res.redirect("/restaurants"));
router.use("/", generalErrorHandler);
module.exports = router;
