const express = require("express");
const router = express.Router();
const passport = require("../config/passport"); // 引入 Passport，需要他幫忙做驗證

const admin = require("./modules/admin");

const restController = require("../controllers/restaurant-controller");
const userController = require("../controllers/user-controller");

const { generalErrorHandler } = require("../middleware/error-handler");

router.use("/admin", admin);

router.get("/signup", userController.signUpPage);
router.post("/signup", userController.signUp); // 注意用 post

router.get("/signin", userController.signInPage);
router.post(
  "/signin",
  //請 Passport 直接做身分驗證
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
  }),
  userController.signIn
); // 注意是 post
router.get("/logout", userController.logout);

router.get("/restaurants", restController.getRestaurants);

router.get("/", (req, res) => res.redirect("/restaurants"));

router.use("/", generalErrorHandler); // middleware另外處理，不影響路由，所以這句放哪都行

module.exports = router;
