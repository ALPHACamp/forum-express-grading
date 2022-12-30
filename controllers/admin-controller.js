// 前台restaurant專用的controller

const adminController = {
  getRestaurants: (req, res) => {
    return res.render('admin/restaurants')
  }
}

module.exports = adminController
