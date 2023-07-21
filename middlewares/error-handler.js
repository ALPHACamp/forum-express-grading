const RegisterError = require('../errors/register-error')
const generalErrorHandler = (err, req, res, next) => {
  if (err instanceof RegisterError) { // 練習用自創error
    req.flash('error_messages', `Register Error: ${err.message}`)
  } else if (err instanceof Error) {
    req.flash('error_messages', `${err.name}: ${err.message}`)
  } else {
    req.flash('error_messages', `Non Error Class Error: ${err.message}`)
  }
  res.redirect('back')// 回到上一頁
  next(err)
}

module.exports = generalErrorHandler
