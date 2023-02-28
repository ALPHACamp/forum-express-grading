module.exports = {
  generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back') // 丟回前一頁

    next(err)
  }
}
