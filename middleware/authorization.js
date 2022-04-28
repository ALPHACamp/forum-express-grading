const db = require('../models')
const { User } = db

module.exports.authorizedUser = (req, res, next) => {
  User.findByPk(req.params.id)
    .then(user => {
      if (user.id !== Number(req.session.user_id)) {
        req.flash('error_messages', 'You do not have permission to do that.')
        return res.redirect(`/users/${req.session.user_id}`)
      }
      next()
    })
    .catch(err => next(err))
}
