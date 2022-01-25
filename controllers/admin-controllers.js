const adminController = {
  getRestaurant: (req, res) => {
    return res.render('admin/restaurants')
  }
}

module.exports = adminController
