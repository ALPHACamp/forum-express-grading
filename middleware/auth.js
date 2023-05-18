const { ensureAuthenticated, getUser } = require("../helpers/auth-helpers");
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (ensureAuthenticated(req)) {
    return next();
  }
  res.redirect("/signin");
};
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) return next();
    res.redirect("/");
  } else {
    res.redirect("/signin");
  }
  res.redirect("/admin/restaurants");
};
module.exports = {
  authenticated,
  authenticatedAdmin,
};
