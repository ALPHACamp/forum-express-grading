// controller 是一種 object
const adminController = {
  getRestaurants: (req, res) => {
    return res.render('admin/restaurants')
  }
}
module.exports = adminController
