module.exports = {
  generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      // if err is error object
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back')
    next(err)
  }

}
