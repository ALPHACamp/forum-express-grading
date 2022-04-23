const adminController = {
  getRestaurants: (req, res) => {
    console.log('here')
    return res.render('admin/restaurants')
  }
}
module.exports = adminController
