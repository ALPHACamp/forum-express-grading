module.exports = {
  generalErrorHandler (err, req, res, next) {
    // 判斷傳入的 err 是不是一個 Error 物件
    if (err instanceof Error) {
      console.log(err)
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back')
    next(err)
  }
}
