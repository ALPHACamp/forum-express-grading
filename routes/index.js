const express = require("express");
const router = express.Router();
const passport = require("../config/passport"); // @Add

const restController = require("../controllers/restaurant-controller");
const userController = require("../controllers/user-controller");
const { generalErrorHandler } = require("../middleware/error-handler");
const { authenticated, authenticatedAdmin } = require("../middleware/auth"); // 引入 auth.js

const admin = require("./modules/admin");
router.use("/admin", authenticatedAdmin, admin);

router.get("/signup", userController.signUpPage);
router.post("/signup", userController.signUp);
router.get("/signin", userController.signInPage); // @Add
router.post(
  "/signin",
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
  }),
  userController.signIn
); // 注意是 post , @Add
router.get("/logout", userController.logout); // @Add

router.get("/restaurants", authenticated, restController.getRestaurants);

router.get("/", (req, res) => res.redirect("/restaurants"));
router.use("/", generalErrorHandler);

module.exports = router;
