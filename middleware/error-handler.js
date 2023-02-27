module.exports = {
  generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      console.log(err.name)
      console.log(err.message)

      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back')
    next(err)
  }
}
