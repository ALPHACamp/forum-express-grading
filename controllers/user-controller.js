const bcrypt = require('bcryptjs')
const { RegisterError, UserCRUDError, FavoriteError } = require('../errors/errors')
const { User, Comment, Restaurant, Favorite } = require('../models') // 用解構付值把db內的User model拿出來
const { imgurFileHandler } = require('../helpers/file-helper')
const { getCommentedRests } = require('../helpers/user-helper')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      console.log(email)
      if (password !== passwordCheck) {
        throw new RegisterError('Passwords do not match!') // throw error時和return一樣會直接停下來
      }

      // 用email註冊帳號 或尋找
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      const [created] = await User.findOrCreate({ // findOrCreate回傳user 與 count, user模有用到所以不要取出
        where: { email },
        defaults: {
          name,
          email,
          password: hash
        }
      })

      // 如果已存在user就抱錯
      // created 指的是是不是剛創的值
      console.log(`created: ${created}`)
      if (!created) {
        console.log('I am here')
        throw new RegisterError('Email already exists!') // throw error時和return一樣會直接停下來
      }

      req.flash('success_messages', '成功註冊帳號！')// 如果成功（上面都跑完）才回傳訊息
      res.redirect('/signin')
    } catch (error) {
      return next(error) // middleware如果next內包東西，next會認為提供的東西是error message，會走錯誤路線
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: async (req, res, next) => {
    req.logout(function (err) {
      if (err) { return next(err) }
      res.redirect('/signin')
    })
  },
  getUser: async (req, res, next) => {
    // 需要讓每個人都可以看到別的用戶
    // 但是只能更改自己帳戶
    try {
      const { id } = req.params
      const targetUser = await User.findByPk(id,
        {
          nest: true,
          include: [{
            model: Comment,
            include: Restaurant
          }]
        }
      )
      if (!targetUser) throw new UserCRUDError('User did not exist!')

      /* 找出所有評論過得清單 */
      const commentedRests = getCommentedRests(targetUser)

      return res.render('users/profile', {
        user: targetUser.toJSON(),
        loginUser: req.user, // 如果user和loginUser不一樣就不顯示edit
        restaurants: commentedRests
      })
    } catch (error) {
      return next(error)
    }
  },

  editUser: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id) // 型態檢查在 user-helper的blockEditFromOtherUser
      const user = await User.findByPk(id)
      if (!user) throw new UserCRUDError('User did not exist!')
      return res.render('users/edit', { user: user.toJSON() })
    } catch (error) {
      return next(error)
    }
  },

  putUser: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id) // 型態檢查在 user-helper的blockEditFromOtherUser
      const user = await User.findByPk(id)
      if (!user) throw new UserCRUDError('User did not exist!')

      const { body, file } = req
      const { name } = body
      if (!name) throw new UserCRUDError('User need a name!')

      const filePath = await imgurFileHandler(file)
      await user.update({
        name,
        image: filePath || null
      })
      req.flash('success_messages', '使用者資料編輯成功')
      return res.redirect(`/users/${user.id}`)
    } catch (error) {
      return next(error)
    }
  },
  addFavorite: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const userId = req.user.id
      /* 防呆，防止更新到不存在的restaurant或已存在的favorite */
      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Favorite.findOne({
          where: {
            restaurantId,
            userId
          }
        })
      ])
      if (!restaurant) throw new FavoriteError("Restaurant didn't exist!")
      if (favorite) throw new FavoriteError('You have favorited this restaurant!')

      await Favorite.create({
        restaurantId,
        userId
      })

      /* 導回前一頁 */
      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  },
  removeFavorite: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const userId = req.user.id
      const favorite = await Favorite.findOne({
        where: {
          restaurantId,
          userId
        }
      })

      if (!favorite) throw new FavoriteError("You haven't favorited this restaurant")

      await favorite.destroy()
      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  }

}
module.exports = userController
