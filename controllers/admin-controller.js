const adminController = {
  getRestaurants: async (req, res) => {
    return res.render('admin/restaurants')
  }
}
module.exports = adminController
