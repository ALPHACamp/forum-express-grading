module.exports = {
  errorHandler (err, req, res, next) {
    if (err instanceof Error) {
      req.flash('error', `${err.name}: ${err.message}`)
    } else {
      req.flash('error', `${err}`);
    }
    res.redirect('back')
    next(err)
  }
}
