module.exports = {
  getUser: req => {
    return req.user || null
  }
}
