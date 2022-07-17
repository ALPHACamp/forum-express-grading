module.exports = {
  generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      console.log('error exits')
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back')

    next(err)
  }
}
