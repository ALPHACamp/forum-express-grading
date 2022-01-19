module.exports = {
  generalErrorHandler (err, req, res, next) {
    // Catch the Error object, parse it
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      // Other error message
      req.flash('error_messages', `${err}`)
    }

    // Last page had no error, show last page
    res.redirect('back')

    // Pass the error into next error-middleware to detect which kind of error it is
    next(err)
  }
}
