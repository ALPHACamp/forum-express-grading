module.exports = {
  generalErrorHandler (error, req, res, next) {
    /**
     * check if error is an Error Object
     * if true, this object own properties: name and message
     * if false, console.log() error message
     */
    if (error instanceof Error) {
      req.flash('error_messages', `${error.name}: ${error.message}`)
    } else {
      req.flash('error_messages', `${error}`)
    }

    res.redirect('back')
    next(error)
  }
}