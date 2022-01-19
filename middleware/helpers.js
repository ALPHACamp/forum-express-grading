const { getUser } = require('./auth-helpers')

const helpers = {
  localVariable: (req, res, next) => {
    res.locals.success_messages = req.flash('success_messages')
    res.locals.error_messages = req.flash('error_messages')
    res.locals.warning_messages = req.flash('warning_messages')
    res.locals.user = getUser(req)
    next()
  }
}

module.exports = helpers
