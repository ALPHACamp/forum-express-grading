const adminController = {
  getRestaurants: (req, res) => {
    res.render('admin/restaurants')
  }
}

module.exports = adminController
