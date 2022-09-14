
module.exports = {
  generalErrorHandler: (err, req, res, next) => {
    console.log('here is generalErrorHandler')
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}:${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back')
    // res.redirect('/admin/restaurants')
    next(err)
  }
}
