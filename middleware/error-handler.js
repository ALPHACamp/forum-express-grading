module.exports = {
  generalErrorHandler: (err, req, res, next) => {
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }
    //* 上一頁
    res.redirect('back')
    next(err)
  }
}
