const adminController = {
  getRestaurants (_req, res) {
    return res.render('admin/restaurants')
  }
}

module.exports = adminController
