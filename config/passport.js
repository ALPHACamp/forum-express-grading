const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const { User, Restaurant } = require('../models');

// set up local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    // note cb 表示驗證完後要用於另一個callback function
    (req, email, password, cb) => {
      User.findOne({ where: { email } }).then(user => {
        if (!user) {
          return cb(
            null,
            false,
            req.flash('error_messages', 'This email is not registered!!')
          );
        }

        bcrypt.compare(password, user.password).then(res => {
          if (!res) {
            return cb(
              null,
              false,
              req.flash('error_messages', 'Email or password is incorrect !!')
            );
          }
          return cb(null, user);
        });
      });
    }
  )
);

// set up the serialize and deserialize
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  return User.findByPk(id, {
    include: [
      //  note as:所取的名稱會對應到user model裡使用的名稱，所以要修正要同時修正model裡面的as:
      { model: Restaurant, as: 'FavoritedRestaurants' }
    ]
  })
    .then(user => {
      // note JSON化後，可以容易透過Sequelize來操作此筆資料。若無JSON化，則會多出Sequelize的instance
      cb(null, user.toJSON());
    })
    .catch(err => cb(err))
});

module.exports = passport;
