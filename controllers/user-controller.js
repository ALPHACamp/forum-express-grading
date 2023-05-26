const bcrypt = require("bcryptjs"); //載入 bcrypt
const { imgurFileHandler } = require("../helpers/file-helpers");
const { User, Restaurant, Comment, Favorite, Like } = require("../models");
const user = require("../models/user");
const userController = {
  signUpPage: (req, res) => {
    res.render("signup");
  },
  signUp: (req, res, next) => {
    //修改這裡
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck)
      throw new Error("Passwords do not match!");

    // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
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
      .catch((err) => next(err)); //接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  signInPage: (req, res) => {
    res.render("signin");
  },
  signIn: (req, res) => {
    req.flash("success_messages", "成功登入！");
    res.redirect("/restaurants");
  },
  logout: (req, res) => {
    req.flash("success_messages", "登出成功！");
    req.logout();
    res.redirect("/signin");
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: {
        model: Comment,
        include: Restaurant,
      },
      order: [[Comment, "id", "DESC"]],
      nest: true,
    })
      .then((user) => {
        if (!user) throw new Error("User didn't exist!");
        if (req.user) {
          if (user.id !== req.user.id) {
            req.flash("error_messages", "You are not user!");
            res.redirect(`/users/${req.user.id}`);
          }
        }
        return res.render("users/profile", {
          user: user.toJSON(),
        });
      })
      .catch((err) => next(err));
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      raw: true,
      nest: true,
    })
      .then((user) => {
        if (!user) throw new Error("User didn't exist!");
        if (req.user) {
          if (user.id !== req.user.id) {
            req.flash("error_messages", "You are not user!");
            res.redirect(`/users/${req.user.id}`);
          }
        }
        return res.render("users/edit", { user });
      })
      .catch((err) => next(err));
  },
  putUser: (req, res, next) => {
    const { name } = req.body;
    const { file } = req;
    if (!name) throw new Error("Name is required");
    return Promise.all([User.findByPk(req.params.id), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!");
        if (user.id !== req.user.id)
          throw new Error("User can't modify others profile");
        return user.update({
          name,
          image: filePath || user.image,
        });
      })
      .then(() => {
        req.flash("success_messages", "使用者資料編輯成功");
        res.redirect(`/users/${req.params.id}`);
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
};
module.exports = userController;
