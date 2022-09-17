module.exports = {
  generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      console.log('錯誤路由', err.name)
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back')
    next(err)
  }
}
