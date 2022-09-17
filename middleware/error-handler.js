module.exports = {
  generalErrorHandler (err, req, res, next) {
    (err instanceof Error) ? req.flash('error_messages', `${err.name}: ${err.message}`) : req.flash('error_messages', `${err}`)

    res.redirect('back')
    next(err)
  }
}
