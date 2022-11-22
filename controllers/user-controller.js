const bcrypt = require("bcryptjs"); // 載入 bcrypt
const db = require("../models");
const { User } = db;
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
    User.findOne({ where: { email: req.body.email } })
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
};
module.exports = userController;
