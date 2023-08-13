const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

const checkUserOwnership = (req, res, next) => {
  const currentUserId = req.user.id
  const targetUserId = parseInt(req.params.id) // 將ID從字串轉換成數字

  if (currentUserId !== targetUserId) {
    req.flash('error_messages', '無權限進行此操作！')
    return res.redirect('back') // 返回上一頁
  }

  next()
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  checkUserOwnership
}
