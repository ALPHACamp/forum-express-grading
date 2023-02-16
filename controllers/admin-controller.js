// 後台專用
const adminController = {
  getRestaurants: (req, res) => {
    res.render('admin/restaurants')
  }
}

module.exports = adminController
