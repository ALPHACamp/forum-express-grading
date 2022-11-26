module.exports = {
  getUser: req => {
    return req.User || null
  }
}
