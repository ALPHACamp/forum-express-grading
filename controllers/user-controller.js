const bcrypt = require("bcryptjs"); //載入 bcrypt
const { User, Restaurant, Comment, Favorite, Like } = require("../models");
const { localFileHandler } = require("../helpers/file-helpers");
const userController = {
  signUpPage: (req, res) => {
    res.render("signup");
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck)
      throw new Error("Passwords do not match!");
    User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (user) throw new Error("Email already exists!");
        return bcrypt.hash(req.body.password, 10); // 前面加 return
      })
      .then((hash) =>
        User.create({
          //上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
          name: req.body.name,
          email: req.body.email,
          password: hash,
        })
      )
      .then(() => {
        req.flash("success_messages", "成功註冊帳號！"); //並顯示成功訊息
        res.redirect("/signin");
      })
      .catch((error) => next(error));
  },
  signInPage: (req, res) => {
    res.render("signin");
  },
  signIn: (req, res) => {
    req.flash("success_messages", "成功登入！");
    res.redirect("/restaurants");
  },
  logout: (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success_messages", "你已經成功登出。");
      res.redirect("/signin");
    });
  },
  getUser: (req, res) => {
    const userId = req.params.id;
    return Promise.all([
      User.findByPk(req.params.id, {
        raw: true,
      }),
      Comment.findAll({
        where: { userId },
        include: [Restaurant],
      }),
    ])
      .then(([user, comment]) => {
        const restaurants = comment.map((comment) => comment.Restaurant);
        const commented = restaurants.length;
        return res.render("users/profile", { user, restaurants, commented });
      })
      .catch((err) => next(err));
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then((user) => {
        return res.render("users/edit", { user });
      })
      .catch((err) => next(err));
  },
  putUser: (req, res, next) => {
    const id = req.params.id;
    const { name } = req.body;
    const { file } = req; // 把檔案取出來
    return Promise.all([
      // 非同步處理
      User.findByPk(req.params.id), // 去資料庫查有沒有這間餐廳
      localFileHandler(file), // 把檔案傳到 file-helper 處理
    ])
      .then(([user, filePath]) => {
        return user.update({
          name,
          image: filePath || User.image,
        });
      })
      .then(() => {
        req.flash("success_messages", "使用者資料編輯成功");
        res.redirect(`/users/${id}`);
      })
      .catch((err) => next(err));
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params;
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId,
        },
      }),
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!");
        if (favorite) throw new Error("You have favorited this restaurant!");

        return Favorite.create({
          userId: req.user.id,
          restaurantId,
        });
      })
      .then(() => res.redirect("back"))
      .catch((err) => next(err));
  },
  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId,
      },
    })
      .then((favorite) => {
        if (!favorite) throw new Error("You haven't favorited this restaurant");

        return favorite.destroy();
      })
      .then(() => res.redirect("back"))
      .catch((err) => next(err));
  },
  addLike: (req, res, next) => {
    const { restaurantId } = req.params;
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId,
        },
      }),
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!");
        if (like) throw new Error("You have liked this restaurant!");

        return Like.create({
          userId: req.user.id,
          restaurantId,
        });
      })
      .then(() => res.redirect("back"))
      .catch((err) => next(err));
  },
  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId,
      },
    })
      .then((like) => {
        if (!like) throw new Error("You haven't liked this restaurant");

        return like.destroy();
      })
      .then(() => res.redirect("back"))
      .catch((err) => next(err));
  },
  getTopUsers: (req, res, next) => {
    // 撈出所有 User 與 followers 資料
    return User.findAll({
      include: [{ model: User, as: "Followers" }],
    })
      .then((users) => {
        // 整理 users 資料，把每個 user 項目都拿出來處理一次，並把新陣列儲存在 users 裡
        users = users.map((user) => ({
          // 整理格式
          ...user.toJSON(),
          // 計算追蹤者人數
          followerCount: user.Followers.length,
          // 判斷目前登入使用者是否已追蹤該 user 物件
          isFollowed: req.user.Followings.some((f) => f.id === user.id),
        }));
        res.render("top-users", { users: users });
      })
      .catch((err) => next(err));
  },
};
module.exports = userController;
