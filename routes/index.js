const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const restController = require("../controllers/restaurant-controller");
const admin = require("./modules/admin");
const userController = require("../controllers/user-controller");
const { generalErrorHandler } = require("../middleware/error-handler");
const { authenticated, authenticatedAdmin } = require("../middleware/auth");
const commentController = require("../controllers/comment-controller");
const upload = require("../middleware/multer");
router.use("/admin", authenticatedAdmin, admin);
router.get("/signup", userController.signUpPage);
router.post("/signup", userController.signUp);
router.get("/restaurants/:id/dashboard", restController.getDashboard);
router.get("/restaurants/feeds", authenticated, restController.getFeeds);
router.get("/restaurants/:id", authenticated, restController.getRestaurant);
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
router.get("/logout", userController.logout);
router.delete(
  "/comments/:id",
  authenticatedAdmin,
  commentController.deleteComment
);
router.post("/comments", authenticated, commentController.postComment);
router.post(
  "/favorite/:restaurantId",
  authenticated,
  userController.addFavorite
);
router.delete(
  "/favorite/:restaurantId",
  authenticated,
  userController.removeFavorite
);
router.post("/like/:restaurantId", authenticated, userController.addLike);
router.delete("/like/:restaurantId", authenticated, userController.removeLike);
router.get("/users/:id/edit", authenticated, userController.editUser);
router.get("/users/:id", authenticated, userController.getUser);
router.put("/users/:id", upload.single("image"), userController.putUser);
router.get("/", (req, res) => res.redirect("/restaurants"));
router.use("/", generalErrorHandler);
module.exports = router;
