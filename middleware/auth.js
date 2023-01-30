const helpers = require('../helpers/auth-helpers');

// 使用者是否驗證
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next();
  }

  res.redirect('/signin');
};

// admin使用者與一般使用者判斷驗證邏輯
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next();

    res.redirect('/');
  } else {
    res.redirect('/signin');
  }
};

module.exports = {
  authenticated,
  authenticatedAdmin
};
