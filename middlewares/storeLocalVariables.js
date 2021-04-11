const helpers = require('../_helpers')
module.exports = {
  storeLocalVariables: (req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.user = helpers.getUser(req)
    next()
  }
}