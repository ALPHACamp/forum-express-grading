const adminController = {
  getRestaurants: (req, res) => {
    res.render('admin/restaurants')
  }
}

exports = module.exports = adminController
