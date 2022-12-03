const bcrypt = require("bcryptjs"); // 載入 bcrypt
const {
  localFileHandler,
  imgurFileHandler,
} = require("../helpers/file-helpers");
const {
  Restaurant,
  User,
  Comment,
  Favorite,
  Like,
  Followship,
} = require("../models");
const { getUser } = require("../helpers/auth-helpers");
const userController = {
  signUpPage: (req, res) => {
    res.render("signup");
  },
  signUp: (req, res, next) => {
    // 用到req.body，所以別忘了使用body-parser，不然會Error:Cannot read property of undefined
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error("Passwords do not match!");
    }

    // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({ where: { email: req.body.email.trim() } })
      .then((user) => {
        if (user) throw new Error("Email already exists!"); // 不是箭頭式，所以常規上變數user要加上括號
        return bcrypt.hash(req.body.password, 10); // 加return給下一個then，即 hash =bcrypt.hash(req.body.password, 10)
      })
      .then((hash) =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        })
      )
      // 由於下面這then沒用到變數，所以上面then省略return (建議還是放著)
      .then(() => {
        req.flash("success_messages", "成功註冊帳號!");
        res.redirect("/signin");
      })
      .catch((err) => next(err)); // 接住前面throw的Error，呼叫專門做錯誤處理的 middleware。記得第一句要加上next
  },
  signInPage: (req, res) => {
    res.render("signin");
  },
  signIn: (req, res) => {
    // 驗證過程放在路由那，此處收到 request 時，就一定是登入後的使用者了
    req.flash("success_messages", "成功登入！");
    res.redirect("/restaurants");
  },
  logout: (req, res) => {
    req.flash("success_messages", "登出成功！");
    req.logout(); // Passport 提供的語法，會把 user id 對應的 session 清除掉
    res.redirect("/signin");
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [{ model: Comment, include: Restaurant }],
      order: [[Comment, "createdAt", "desc"]], // desc大小寫都可
    })
      .then((user) => {
        if (!user) throw new Error("User doesn't exist!");
        // console.log("user toJSON", user.toJSON());
        // user toJSON {
        //   id: 1,
        //   name: 'root',
        //   email: 'root@example.com',
        //   password: '$2a$1****',
        //   isAdmin: true,
        //   image: 'https://i.imgur.com/d07pwY9.jpeg',
        //   createdAt: 2022-12-01T08:22:54.000Z,
        //   updatedAt: 2022-12-01T12:09:59.000Z,
        //   Comments: [
        //     {
        //       id: 2,
        //       text: '55688\r\n',
        //       userId: 1,
        //       restaurantId: 1,
        //       createdAt: 2022-12-01T08:25:48.000Z,
        //       updatedAt: 2022-12-01T08:25:48.000Z,
        //       Restaurant: [Object]
        //     },
        //     {
        //       id: 1,
        //       text: '測試1',
        //       userId: 1,
        //       restaurantId: 1,
        //       createdAt: 2022-12-01T08:25:37.000Z,
        //       updatedAt: 2022-12-01T08:25:37.000Z,
        //       Restaurant: [Object]
        //     }
        //   ]
        // }
        res.render("users/profile", {
          userProfile: user.toJSON(), // header.hbs有用到user，所以要另外取名
          user: getUser(req),
        });
      })
      .catch((err) => next(err));
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then((user) => {
        if (!user) throw new Error("User doesn't exist!");
        res.render("users/edit", { user });
      })
      .catch((err) => next(err));
  },
  putUser: (req, res, next) => {
    const { name } = req.body;
    const file = req.file;
    // console.log(req.body); [Object: null prototype] { name: 'root1' } (前者為檔案，後者為name)
    if (!name) throw new Error("User name is required!");
    return Promise.all([User.findByPk(req.params.id), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User doesn't exist!");
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
          userId: req.user.id, // 或getUser(req).id
          restaurantId,
        },
      }),
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!");
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
          userId: getUser(req).id,
          restaurantId,
        },
      }),
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!");
        if (like) throw new Error("You have liked this restaurant!");

        return Like.create({
          userId: getUser(req).id,
          restaurantId,
        });
      })
      .then(() => res.redirect("back"))
      .catch((err) => next(err));
  },
  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        userId: getUser(req).id,
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
        const result = users
          .map((user) => ({
            // 整理格式
            ...user.toJSON(),
            // 計算追蹤者人數
            followerCount: user.Followers.length,
            // 判斷目前登入使用者的追蹤清單是否已包含該 user 物件
            isFollowed: req.user.Followings.some((f) => f.id === user.id),
          }))
          .sort((a, b) => b.followerCount - a.followerCount); //由大到小
        res.render("top-users", { users: result });
      })
      .catch((err) => next(err));
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params;
    Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId,
        },
      }),
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User doesn't exist!");
        if (followship) throw new Error("You are already following this user!");
        return Followship.create({
          followerId: req.user.id,
          followingId: userId,
        });
      })
      .then(() => res.redirect("back"))
      .catch((err) => next(err));
  },
  removeFollowing: (req, res, next) => {
    Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId,
      },
    })
      .then((followship) => {
        if (!followship) throw new Error("You haven't followed this user!");
        return followship.destroy();
      })
      .then(() => res.redirect("back"))
      .catch((err) => next(err));
  },
};
module.exports = userController;
