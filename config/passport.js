const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;

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
  User.findByPk(id).then(user => {
    // note JSON化後，可以容易透過Sequelize來操作此筆資料。若無JSON化，則會多出Sequelize的instance
    user = user.toJSON();
    return cb(null, user);
  });
});

module.exports = passport;
