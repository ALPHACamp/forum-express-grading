const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

// set up Passport strategy
passport.use(
  new LocalStrategy(
    // 第一個參數傳入客製化的選項: customize user field
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // 因為flash需要req，true後才可以給下面用req
    },
    // 第二個參數是一個 callback function: authenticate user
    // email也可以自取，例如改成username，where {email:username}。官方文件用done，教案TA習慣用cb。
    (req, email, password, cb) => {
      User.findOne({ where: { email } }).then(user => {
        if (!user) {
          return cb(
            null,
            false,
            req.flash('error_messages', '帳號或密碼輸入錯誤！')
          )
        }
        bcrypt.compare(password, user.password).then(res => {
          if (!res) {
            return cb(
              null,
              false,
              req.flash('error_messages', '帳號或密碼輸入錯誤！')
            )
          }
          return cb(null, user)
        })
      })
    }
  )
)
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  return User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ] // as名來源自User model中的設定
  })
    .then(user => {
      cb(null, user.toJSON())
      // 登入後產生console.log(user.toJSON());
      // {
      //   id: 1,
      //   name: 'root',
      //   email: 'root@example.com',
      //   password: '$2***',
      //   isAdmin: true,
      //   image: 'https://i.imgur.com/d07pwY9.jpeg',
      //   createdAt: 2022-12-01T08:22:54.000Z,
      //   updatedAt: 2022-12-01T14:21:49.000Z,
      //   FavoritedRestaurants: [
      //     {
      //       id: 2,
      //       name: 'Ernest Parker',
      //       tel: '1-750-252-2082 x185',
      //       address: '2732 Boehm Track',
      //       openingHours: '08:00',
      //       description: 'et',
      //       image: 'https://loremflickr.com/320/240/restaurant,food/?random=27.46213842538325',
      //       viewCounts: 4,
      //       createdAt: 2022-12-01T08:22:55.000Z,
      //       updatedAt: 2022-12-01T15:23:17.000Z,
      //       categoryId: 7,
      //       Favorite: [Object]
      //     },
      //     {
      //       id: 3,
      //       name: 'Karla Collins',
      //       tel: '503.760.7391 x84655',
      //       address: '861 McLaughlin Roads',
      //       openingHours: '08:00',
      //       description: 'Culpa dolor accusamus.',
      //       image: 'https://loremflickr.com/320/240/restaurant,food/?random=19.41431277567167',
      //       viewCounts: 3,
      //       createdAt: 2022-12-01T08:22:55.000Z,
      //       updatedAt: 2022-12-01T14:35:04.000Z,
      //       categoryId: 2,
      //       Favorite: [Object]
      //     }
      //   ]
      // }
    })
    .catch(err => cb(err))
})

// 以下console範例
// passport.deserializeUser((id, cb) => {
//   User.findByPk(id).then(user => {
//     // console.log(user);
//     // User {
//     //   dataValues: {
//     //     id: 1,
//     //     name: 'test',
//     //     email: 'test1@tt.tt',
//     //     password: '$2a$10$S.RBcI0QnouTaxrkvcKmtOPCA0x.pHnoQzrKS1THl.6NhIdZU7nba',
//     //     createdAt: 2022-11-22T03:48:44.000Z,
//     //     updatedAt: 2022-11-22T03:48:44.000Z
//     //   },
//     //   _previousDataValues: {
//     //     id: 1,
//     //     name: 'test',
//     //     email: 'test1@tt.tt',
//     //     password: '$2a$10$S.RBcI0QnouTaxrkvcKmtOPCA0x.pHnoQzrKS1THl.6NhIdZU7nba',
//     //     createdAt: 2022-11-22T03:48:44.000Z,
//     //     updatedAt: 2022-11-22T03:48:44.000Z
//     //   },
//     //   uniqno: 1,
//     //   _changed: Set(0) {},
//     //   _options: {
//     //     isNewRecord: false,
//     //     _schema: null,
//     //     _schemaDelimiter: '',
//     //     raw: true,
//     //     attributes: [ 'id', 'name', 'email', 'password', 'createdAt', 'updatedAt' ]
//     //   },
//     //   isNewRecord: false
//     // }
//     user = user.toJSON()
//     //  console.log("toJSON後", user);
//     //  toJSON後 {
//     //   id: 1,
//     //   name: 'test',
//     //   email: 'test1@tt.tt',
//     //   password: '$2a$10$S.RBcI0QnouTaxrkvcKmtOPCA0x.pHnoQzrKS1THl.6NhIdZU7nba',
//     //   createdAt: 2022-11-22T03:48:44.000Z,
//     //   updatedAt: 2022-11-22T03:48:44.000Z
//     // }
//     return cb(null, user)
//   })
// })
module.exports = passport

// Sequalize 打包後的物件，多包裝了幾層，並且裡面加上一些 Sequalize 內建的參數與方法，讓我們可以直接透過 Sequalize 操作這筆資料，例如刪除user.delete()或 更新user.date(...) 或簡化user.toJSON()
