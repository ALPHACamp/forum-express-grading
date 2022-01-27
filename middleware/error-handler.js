module.exports = {
  generalErrorHandler: (err, req, res, next) => {
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }
    if (req.body) req.flash('body', JSON.stringify(req.body))
    res.redirect('back')
    next(err)
  }
}
