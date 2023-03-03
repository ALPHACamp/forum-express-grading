module.exports = {
  generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      console.log('yyyyy顯示err')
      console.log('yyyyy顯示err')
      console.log('yyyyy顯示err')
      console.log(err)
      req.flash('error_messages', `${err.message}`)
      // req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      console.log('顯示err')
      console.log('顯示err')
      console.log('顯示err')
      console.log(err)
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back') // 丟回前一頁

    next(err)
  }
}
